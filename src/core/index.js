const RssParser = require('../drivers/rss-parser');

const ChatRepository = require('../infra/repositories/chat_repository');
const FeedRepository = require('../infra/repositories/feed_repository');
const PostRepository = require('../infra/repositories/post_repository');

const chatRepository = new ChatRepository();
const feedRepository = new FeedRepository();
const postRepository = new PostRepository();

const rssParser = new RssParser();
const time = new Date;

async function getChatsData() {
  const chatsIds = await chatRepository.getAllChatsIdActive();

  if (chatsIds.length === 0) return chatsIds;

  const data = [];

  await Promise.all(chatsIds.map(async chat => {
    const items = await feedRepository.getFeeds(chat.id);
    data.push(...items);

    return items;
  }))

  async function fetchData(feed) {
    const items = await rssParser.getFeeds(feed.rss_url);
    return { data: items, chat_id: feed.chat_id, title: feed.title, hashtags: feed.hashtag };
  }
  
  const items = data.map(feed => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        return resolve(await fetchData(feed));
      }, 5000)});
    })
  
  const feeds = await Promise.all(items);
  return feeds;
}

function sendMessages({ feed, data, bot }) {
  data.forEach(async (item, index) => {
    const defaultObject = { title: item.title, chat_id: feed.chat_id };
    
    if (!(await postRepository.existsPost(defaultObject))) {
      await postRepository.addPost(defaultObject);
      
      setTimeout(() => {
        bot.telegram.sendMessage(feed.chat_id, 
          `<strong>Novo post ✅</strong><code>\n\n${item.title}</code>\n\n<a href='${item.link}'>Ler post completo ➡️</a>\n\nDe: <i>${feed.title}</i>\n\n${feed.hashtags}`, 
          { parse_mode: 'HTML'})
      }, index * process.env.BOT_INTERVAL_SEND_POSTS);
    }
  });
}

function isUTCMidNight() {
  const utcHours = time.getUTCHours() === 0;
  const utcMinutes = time.getUTCMinutes() <= 1;
  const utcSeconds = time.getUTCSeconds() <= 58;

  return (utcHours && utcMinutes && utcSeconds) ? true : false;
}

async function start(bot) {
  const data = await getChatsData();

  if (isUTCMidNight()) await postRepository.dropAllPosts();
  if (data.length === 0) return data;
  
  data.forEach(async feed => {
    const { count } = await postRepository.getPostsCount({ chat_id: feed.chat_id});
   
    feed.data.splice(0, count);
    const items = feed.data.slice(0, process.env.BOT_COUNT_POSTS);

    sendMessages({ feed, data: items, bot });
  });
}

async function main(bot) {
  await start(bot);
  setInterval(async () => await start(bot), process.env.BOT_INTERVAL_GET_POSTS);
}

module.exports = main;
