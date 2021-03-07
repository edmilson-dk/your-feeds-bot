const { start_bot, start_service, home, cmd_error, not_member_admin, } = require('../messages/commands');
const  { go_back_btn } = require('../messages/inline_keyboard');
const { homeMarkup, timezonesMarkup, isNotMemberOrAdmin } = require('../markups');
const { getChatId, isBotAdmin, isAdmin, isStillMemberAndAdmin } = require('../helpers/bot_helpers');
const { asyncFilter } = require('../helpers/features_helpers');

const User = require('../domain/User');
const Feed = require('../domain/Feed');
const Chat = require('../domain/Chat');

const UserRepository = require('../infra/repositories/user_repository');
const ChatRepository = require('../infra/repositories/chat_repository');
const FeedRepository = require('../infra/repositories/feed_repository');

const setupFeedActions = require('../actions/setup_feed_actions');

const userRepository = new UserRepository();
const chatRepository = new ChatRepository();
const feedRepository = new FeedRepository();

module.exports = bot => {

  bot.start(async ctx => {
    const { type } = await ctx.getChat();

    type === 'private'
      ? ctx.telegram.sendMessage(getChatId(ctx), start_bot.text, timezonesMarkup)
      : ctx.telegram.sendMessage(getChatId(ctx), 'Olá!');  

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
    const userChatID = ctx.chat.id;
   
    const userID = ctx.message.from.id;
    const { id } = await chatRepository.getOneChatByTitle(String(userID), chatTitle);
    
    if ((await isStillMemberAndAdmin(id, userID, { bot }))) {
      const feeds = await feedRepository.getFeeds(id);

      const defaultMarkup = [
        [{ text: 'Adicionar novo feed', callback_data: 'add_new_feed' }],
        [{ text: go_back_btn.text, callback_data: 'manager_feeds' }],
      ]

      const feedsKeyBoard = [];
      
      if (feeds && feeds.length > 0) {
        feedsKeyBoard.forEach(feed => {
          feedsKeyBoard.push(
            [{ text: `${feed.title}`, callback_data:  'clicked_in_feed'}],
          )
        })
      } 
           
      feedsKeyBoard.push(...defaultMarkup);

      ctx.telegram.sendMessage(getChatId(ctx), 'Gerencie os feeds para este chat.', {
        reply_markup: {
          inline_keyboard: feedsKeyBoard, 
        }
      })

      return;
    } else {
      ctx.telegram.sendMessage(userChatID, not_member_admin.text, isNotMemberOrAdmin);
      await chatRepository.dropChat(userID, id);

      return;
    }
  })

  setupFeedActions({bot, chatRepository});
}