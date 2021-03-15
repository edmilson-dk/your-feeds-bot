const { start_service, home, cmd_error, not_member_admin, view_chat, add_feed, remove_feed, active_feed, command_error } = require('../messages/commands');
const { homeMarkup, isNotMemberOrAdminMarkup, goBackManagerFeedsMarkup } = require('../markups');
const { getChatId, isBotAdmin, isAdmin, isStillMemberAndAdmin, removeCommand } = require('../helpers/bot_helpers');
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
      await chatRepository.setNotActiveConfigChats(String(userId));
      
      const user = new User(userId, username);
      await userRepository.add(user.getValue());

      ctx.telegram.sendMessage(getChatId(ctx), home.text, homeMarkup);
      return;
    } else {
      ctx.telegram.sendMessage(getChatId(ctx), 'Olá!'); 
      return;
    }
  })

  bot.command('start_service', async ctxStartServiceCmd => startServiceCommand(ctxStartServiceCmd));
  bot.command('view_chat', async ctxViewChatCmd => viewChatCommand(ctxViewChatCmd));
  bot.command('add', async ctxAddCmd => await addFeedCommand(ctxAddCmd, finishedViewChatCmd));
  bot.command('remove', async ctxRemoveCmd => await removeFeedCommand(ctxRemoveCmd, finishedViewChatCmd));
  bot.command('active', async ctxActiveCmd => await activeChatCommand(ctxActiveCmd, finishedViewChatCmd));

  async function startServiceCommand(ctx) {
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
  }

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

  async function finishedViewChatCmd(ctx, chatId, reset = false) {
    const feedsList = await listFeeds(feedRepository, chatId);
  
    return [
      getChatId(ctx), 
      `${view_chat.text}\n\n${feedsList}`, 
      goBackManagerFeedsMarkup
    ];
  }

  async function viewChatCommand(ctx) {
    const userId = String(ctx.message.from.id);

    if (!(await validateCommand(userId))) {
      ctx.reply(command_error.message);
      return;
    }
    const chatTitle = removeCommand(ctx.message.text,'/view_chat');
   
    if (!chatTitle) {
      ctx.reply(cmd_error.text);
      return;
    }

    const { id: chatId } = await chatRepository.getOneChatByTitle(String(userId), chatTitle);

    if ((await isStillMemberAndAdmin(chatId, userId, { bot }))) {   
      await chatRepository.setActiveConfigChat(chatId, userId, true);

      const message = await finishedViewChatCmd(ctx, chatId);
      ctx.telegram.sendMessage(...message);
      return;

    } else {
      ctx.telegram.sendMessage(chatId, not_member_admin.text, isNotMemberOrAdminMarkup);
      await chatRepository.dropChat(userId, chatId);

      return;
    }
  }

  async function addFeedCommand(ctx, finishedViewChatCmd) {
    const userId = String(ctx.message.from.id);

    if (!(await validateCommand(userId))) {
      ctx.reply(command_error.message);
      return;
    }

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
      const chatId = await chatRepository.getIsActiveConfigChat(userId);
     
      if ((await feedRepository.existsFeedByTitle(title, chatId))) {
        ctx.reply(add_feed.alredy_exists);
        return;
      }

      const feed = new Feed(rssURL, hashtags_formatted, title, chatId);
      await feedRepository.addFeed(feed.getValue());

      ctx.reply(add_feed.success);
      const message = await finishedViewChatCmd(ctx, chatId);
      ctx.telegram.sendMessage(...message);

      return;
    } else {
      ctx.reply(add_feed.invalid_rss);
      return;
    }
  }

  async function removeFeedCommand(ctx, finishedViewChatCmd) {
    const userId = String(ctx.message.from.id);

    if (!(await validateCommand(userId))) {
      ctx.reply(command_error.message);
      return;
    }

    const feedTitle = removeCommand(ctx.message.text, '/remove');

    const chatId = await chatRepository.getIsActiveConfigChat(userId);

    if (!feedTitle) {
      ctx.telegram.sendMessage(getChatId(ctx), remove_feed.cmd_error, { parse_mode: 'HTML'});
      return;
    }
    if (!(await feedRepository.existsFeedByTitle(feedTitle, chatId))) {
      ctx.telegram.sendMessage(getChatId(ctx), remove_feed.invalid_title, { parse_mode: 'HTML'});
      return;
    }

    await feedRepository.dropFeed(feedTitle, chatId);

    ctx.reply(remove_feed.success);
    const message = await finishedViewChatCmd(ctx, chatId);
    ctx.telegram.sendMessage(...message);

    return;
  }

  async function validateCommand(userId) {
    const existsUser = await userRepository.existsUser(userId);
    const existsChat = await chatRepository.containsActiveChatConfig(userId);

    if (!existsUser) return false;
    if (!existsChat) return false;

    return true;
  }

  async function activeChatCommand(ctx, finishedViewChatCmd) {
    const userId = String(ctx.message.from.id);

    if (!(await validateCommand(userId))) {
      ctx.reply(command_error.message);
      return;
    }

    const chatId = await chatRepository.getIsActiveConfigChat(userId);

    if (!(await feedRepository.containChat(chatId))) {
      ctx.reply(active_feed.error);
      return;
    }

    await chatRepository.updateActiveChat(true, chatId);
    await chatRepository.setActiveConfigChat(chatId, userId, false);

    ctx.reply(active_feed.success);
    const message = await finishedViewChatCmd(ctx, chatId);
    ctx.telegram.sendMessage(...message);

    return;
  }

  setupFeedActions({ bot });
}