const { 
  start_bot, start_service, 
  home, cmd_error, not_member_admin, 
  view_chat, add_feed, remove_feed
} = require('../messages/commands');
const  { go_back_btn } = require('../messages/inline_keyboard');

const { homeMarkup, timezonesMarkup, isNotMemberOrAdminMarkup, goBackManagerFeedsMarkup } = require('../markups');
const { getChatId, isBotAdmin, isAdmin, isStillMemberAndAdmin } = require('../helpers/bot_helpers');
const { asyncFilter, isHashtagsValid, removeSpacesInArray, removeNotHashtagsInArray, listFeeds } = require('../helpers/features_helpers');

const User = require('../domain/User');
const Feed = require('../domain/Feed');
const Chat = require('../domain/Chat');

const RssParser = require('../drivers/rss-parser');

const UserRepository = require('../infra/repositories/user_repository');
const ChatRepository = require('../infra/repositories/chat_repository');
const FeedRepository = require('../infra/repositories/feed_repository');

const setupFeedActions = require('../actions/setup_feed_actions');

const userRepository = new UserRepository();
const chatRepository = new ChatRepository();
const feedRepository = new FeedRepository();
const rssParser = new RssParser();

module.exports = bot => {

  bot.start(async ctx => {
    const { type } = await ctx.getChat();
    const userID = String(ctx.from.id);

    if (type === 'private') {
      !(await userRepository.existsUser(userID))
        ? ctx.telegram.sendMessage(getChatId(ctx), start_bot.text, timezonesMarkup)
        : ctx.telegram.sendMessage(getChatId(ctx), home.text, homeMarkup);
    } else {
      ctx.telegram.sendMessage(getChatId(ctx), 'Olá!'); 
    }

    return;
  })

  bot.command('register', async ctx => {
    const [, timezone] = ctx.message.text.split(' ');

    if (!timezone) {
      ctx.reply(cmd_error.text);
      return;
    }

    const user = new User(ctx.from.id, ctx.from.username, timezone);
    await userRepository.add(user.getValue());
    
    ctx.telegram.sendMessage(getChatId(ctx), home.text, homeMarkup);

    return;
  })

 bot.command('start_service', async ctx => {
    const { type, id: chatID, title } = await ctx.getChat();
    const userID = ctx.from.id;
    const isUserAdmin = await isAdmin(userID, ctx);
    const isUserValid = await userRepository.existsUser(String(userID));
    const chat = new Chat(chatID, title, userID);
    
    if (type !== 'private') {
      if (!isUserValid) {
        ctx.reply(start_service.invalid_user);
        return;
      }
      if (isUserValid && !(await isBotAdmin(ctx))) {
        ctx.reply(start_service.not_bot_admin);
        return;
      }
      if (isUserValid && !isUserAdmin) {
        ctx.reply(start_service.not_admin);
        return;
      }
      if ((await chatRepository.existsChat(chatID))) {
        ctx.reply(start_service.chat_alredy_exists);
        return;
      } 

      await chatRepository.addChat(chat.getValues());
      ctx.reply(start_service.success);  

      return;
    }

    return;
  })

  bot.on('channel_post', async ctx => {
    const text = ctx.update.channel_post.text;
    const admins = await ctx.getChatAdministrators(ctx.update.channel_post.chat.id);
    const notMemberBot = admins.filter(item => !item.user.is_bot);

    const userActiveSessionId = await asyncFilter(notMemberBot, async item => {
      const exists = await userRepository.existsUser(String(item.user.id));
      return exists;
    });

    const userID = userActiveSessionId.length > 0 
      ? userActiveSessionId[0].user.id
      : undefined;
      
    const { id: chatID, title } = await ctx.getChat();
    let chat = null;
    
    if (userID) chat = new Chat(chatID, title, userID);

    if (text === '/start_service') {
      if ((await isBotAdmin(ctx)) && chat) {
        await chatRepository.addChat(chat.getValues());
        ctx.reply(start_service.success);  

        return;
      }
      if ((await chatRepository.existsChat(chatID))) {
        ctx.reply(start_service.chat_alredy_exists);
        return;
      } 
    }

    return;
  })

  bot.command('view_chat', async ctx => {
    const chatTitle = ctx.message.text.replace('/view_chat', '').trim();
   
    if (!chatTitle) {
      ctx.reply(cmd_error.text);
      return;
    }

    const userID = ctx.message.from.id;
    const { id: chatID, title } = await chatRepository.getOneChatByTitle(String(userID), chatTitle);
    
    const getMessage = async () => {
      const feedsList = await listFeeds(feedRepository, chatID);
      
      return [
        getChatId(ctx), 
        `${view_chat.text}\n\n${feedsList}`, 
        goBackManagerFeedsMarkup
      ];
    }

    if ((await isStillMemberAndAdmin(chatID, userID, { bot }))) {   
      
      const message = await getMessage();
      ctx.telegram.sendMessage(...message);

      bot.command('add', async ctx => await addFeedCommand(ctx, chatID, getMessage));
      bot.command('remove', async ctx => await removeFeedCommand(ctx, chatID, getMessage));

    } else {
      ctx.telegram.sendMessage(chatID, not_member_admin.text, isNotMemberOrAdminMarkup);
      await chatRepository.dropChat(userID, chatID);

      return;
    }
  })

  async function addFeedCommand(ctx, chat_id, getMessage) {
    let data = ctx.message.text.replace('/add', '').trim().split(' ');
    data = removeSpacesInArray(data);

    const rssURL = data.slice(0, 1).toString();
    const hashtags = removeNotHashtagsInArray(data);

    if (!isHashtagsValid(hashtags)) {
      ctx.telegram.sendMessage(getChatId(ctx), add_feed.cmd_error, { parse_mode: 'HTML'});
      return;
    } 
    
    if ((await rssParser.rssIsValid(rssURL))) {
      const title = await rssParser.getFeedTitle(rssURL);
      const hashtags_formatted = hashtags.join(' ');
      
      if ((await feedRepository.existsFeedByTitle(title, chat_id))) {
        ctx.reply(add_feed.alredy_exists);
        return;
      }

      await feedRepository.addFeed({ 
        rss_url: rssURL,
        hashtag: hashtags_formatted,
        title,
        chat_id
      });

      ctx.reply(add_feed.success);
      const message = await getMessage();
      ctx.telegram.sendMessage(...message);

      return;
    } else {
      ctx.reply(add_feed.invalid_rss);
      return;
    }
  }

  async function removeFeedCommand(ctx, chat_id, getMessage) {
    const feedTitle = ctx.message.text.replace('/remove', '').trim();

    if (!feedTitle) {
      ctx.telegram.sendMessage(getChatId(ctx), remove_feed.cmd_error, { parse_mode: 'HTML'});
      return;
    }
    if (!(await feedRepository.existsFeedByTitle(feedTitle, chat_id))) {
      ctx.telegram.sendMessage(getChatId(ctx), remove_feed.invalid_title, { parse_mode: 'HTML'});
      return;
    }

    await feedRepository.dropFeed(feedTitle, chat_id);

    ctx.reply(remove_feed.success);
    const message = await getMessage();
    ctx.telegram.sendMessage(...message);

    return;
  }

  setupFeedActions({bot});
}