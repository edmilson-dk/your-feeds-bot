const { start_service, home, cmd_error, not_member_admin, view_chat, add_feed, remove_feed, active_feed } = require('../messages/commands');
const { homeMarkup, timezonesMarkup, isNotMemberOrAdminMarkup, goBackManagerFeedsMarkup } = require('../markups');
const { getChatId, isBotAdmin, isAdmin, isStillMemberAndAdmin, removeComma, getChatIdnd } = require('../helpers/bot_helpers');
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
    const userId = ctx.from.id;
    const username = ctx.from.username;

    if (type === 'private') {
      const user = new User(userId, username);
      await userRepository.add(user.getValue());

      ctx.telegram.sendMessage(getChatId(ctx), home.text, homeMarkup);
      return;
    } else {
      ctx.telegram.sendMessage(getChatId(ctx), 'Olá!'); 
      return;
    }
  })

 bot.command('start_service', async ctx => {
    const { type, id: chatId, title } = await ctx.getChat();
    const userId = ctx.from.id;
    const isUserAdmin = await isAdmin(userId, ctx);
    const isUserValid = await userRepository.existsUser(String(userId));
    const chat = new Chat(chatId, title, userId);
    
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
      if ((await chatRepository.existsChat(chatId))) {
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

    const userId = userActiveSessionId.length > 0 
      ? userActiveSessionId[0].user.id
      : undefined;
      
    const { id: chatId, title } = await ctx.getChat();
    let chat = null;
    
    if (userId) chat = new Chat(chatId, title, userId);

    if (text === '/start_service') {
      if ((await isBotAdmin(ctx)) && chat) {
        await chatRepository.addChat(chat.getValues());
        ctx.reply(start_service.success);  

        return;
      }
      if ((await chatRepository.existsChat(chatId))) {
        ctx.reply(start_service.chat_alredy_exists);
        return;
      } 
    }

    return;
  })

  bot.command('view_chat', async ctx => {
    const chatTitle = removeCommand(ctx.message.text,'/view_chat');
   
    if (!chatTitle) {
      ctx.reply(cmd_error.text);
      return;
    }

    const userId = ctx.message.from.id;
    const { id: chatId } = await chatRepository.getOneChatByTitle(String(userId), chatTitle);
    
    const getMessage = async (ctxMsg, chatCmdId) => {
      const feedsList = await listFeeds(feedRepository, chatCmdId);
      
      return [
        getChatId(ctxMsg), 
        `${view_chat.text}\n\n${feedsList}`, 
        goBackManagerFeedsMarkup
      ];
    }

    if ((await isStillMemberAndAdmin(chatId, userId, { bot }))) {   
      
      const message = await getMessage(ctx, chatId);
      ctx.telegram.sendMessage(...message);

      bot.command('add', async ctxAddCmd => await addFeedCommand(ctxAddCmd, chatId, getMessage));
      bot.command('remove', async ctxRemoveCmd => await removeFeedCommand(ctxRemoveCmd, chatId, getMessage));
      bot.command('active', async ctxActiveCmd => await activeChatCommand(ctxActiveCmd, chatId, getMessage));

    } else {
      ctx.telegram.sendMessage(chatId, not_member_admin.text, isNotMemberOrAdminMarkup);
      await chatRepository.dropChat(userId, chatId);

      return;
    }
  })

  async function addFeedCommand(ctx, chat_id, getMessage) {
    let data = removeCommand(ctx.message.text, '/add').split(' ');
    data = removeSpacesInArray(data);

    const rssURL = data.slice(0, 1).toString();
    const hashtags = removeNotHashtagsInArray(data);

    if (hashtags.length > 3) {
      ctx.telegram.sendMessage(getChatId(ctx), add_feed.max_hashtags);
      return;
    }

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

      const feed = new Feed(rssURL, hashtags_formatted, title, chat_id);
      await feedRepository.addFeed(feed.getValue());

      ctx.reply(add_feed.success);
      const message = await getMessage(ctx, chat_id);
      ctx.telegram.sendMessage(...message);

      return;
    } else {
      ctx.reply(add_feed.invalid_rss);
      return;
    }
  }

  async function removeFeedCommand(ctx, chat_id, getMessage) {
    const feedTitle = removeCommand(ctx.message.text, '/remove');

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
    const message = await getMessage(ctx, chat_id);
    ctx.telegram.sendMessage(...message);

    return;
  }

  async function activeChatCommand(ctx, chat_id, getMessage) {
    if (!(await feedRepository.containChat(chat_id))) {
      ctx.reply(active_feed.error);
      return;
    }

    await chatRepository.updateActiveChat(true, chat_id);

    ctx.reply(active_feed.success);
    const message = await getMessage(ctx, chat_id);
    ctx.telegram.sendMessage(...message);
  }

  setupFeedActions({ bot });
}