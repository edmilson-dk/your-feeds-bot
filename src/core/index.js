const RssParser = require('../drivers/rss-parser');

const chatServices = require('../infra/adapters/chat-adapter');
const feedServices = require('../infra/adapters/feed-adapter');
const postServices = require('../infra/adapters/post-adapter');

const rssParser = new RssParser();

async function getChatsData() {
  const chatsIds = await chatServices.getAllChatsIdActive();

  if (chatsIds.length === 0) return chatsIds;

  const data = [];

  await Promise.all(chatsIds.map(async chat => {
    const items = await feedServices.getFeeds({ chatId: chat.id });
    data.push(...items);

    return items;
  }));

  async function fetchData(feed) {
    const items = await rssParser.getFeeds(feed.rss_url);
    
    return { 
      data: items, 
      chat_id: feed.chat_id, 
      title: feed.title, 
      hashtags: feed.hashtag 
    };
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

function sendFeedPosts({ feed, data, bot }) {
  data.forEach(async (item, index) => {
    const defaultObject = { 
      title: item.title.split(' ').join(''), 
      chatId: feed.chat_id };
    
    if (!(await postServices.existsPost(defaultObject))) {
      await postServices.addPost(defaultObject);
      
      setTimeout(() => {
        defaultPostTemplate(bot, {
          chatId: feed.chat_id,
          feedTitle: feed.title,
          link: item.link,
          title: item.title,
          hashtags: feed.hashtags
        });
      }, index * process.env.BOT_INTERVAL_SEND_POSTS);
    }
  });
}

function defaultPostTemplate(bot, { chatId, feedTitle, link, title, hashtags }) {
  bot.telegram.sendMessage(chatId, 
    `<strong>Novo post ✅</strong>
    \n<code>${title}</code>
    \n<a href='${link}'>Ler post completo ➡️</a>
    \nDe: <i>${feedTitle}</i>\n\n${hashtags}`, 
    { parse_mode: 'HTML'});
}

async function start(bot) {
  const data = await getChatsData();

  /* delete posts in database after 1 day of created */
  await postServices.dropAllPosts();

  if (data.length === 0) return data;
  
  data.forEach(feed => {
    sendFeedPosts({ feed, data: feed.data, bot });
  });
}

class Core {
  constructor({ bot }) {
    this._bot = bot;
  }

  async init() {
    await start(this._bot);
    setInterval(async () => await start(this._bot), process.env.BOT_INTERVAL_GET_POSTS);
  }
}

module.exports = Core;
