const { start_bot, start_service } = require('../messages/commands.json');
const { start_bot_keyboard } = require('../messages/inline_keyboard.json');

const { getChatId, isBotAdmin, isAdmin } = require('../helpers/bot_helpers');
const User = require('../domain/User');
const Feed = require('../domain/Feed');
const Chat = require('../domain/Chat');
const UserRepository = require('../infra/repositories/user_repository');
const ChatRepository = require('../infra/repositories/chat_repository');
const FeedRepository = require('../infra/repositories/feed_repository');

const setupFeedActions = require('../actions/setup_feed_actions');

const { manager_feed, help, about } = start_bot_keyboard;

const userRepository = new UserRepository();
const chatRepository = new ChatRepository();
const feedRepository = new FeedRepository();

module.exports = bot => {
  const initMarkup =  {
    reply_markup: {
      inline_keyboard: [
        [{ text: help.text, callback_data: 'help'}, {text: about.text, callback_data: 'about' }],
        [{ text: manager_feed.text, callback_data: 'manager_feed'}],
      ],
    },
  }

  bot.start(async ctx => {
    const { type } = await ctx.getChat();
    const user = new User(String(ctx.from.id), ctx.from.username);
    
    await userRepository.add(user.user_id, user.username);

    type === 'private' 
      ? ctx.telegram.sendMessage(getChatId(ctx), start_bot.text, initMarkup)
      : ctx.telegram.sendMessage(getChatId(ctx), 'Olá!');  
  })

  bot.command('start_service', async ctx => {
    const { type, id: chatID, title } = await ctx.getChat();
    const userID = ctx.from.id;
    const isUserAdmin = await isAdmin(userID, ctx);
    const isUserValid = await userRepository.existsUser(String(userID));
    
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

      await chatRepository.addChat(String(chatID), title, '3.600', String(userID));
      
      ctx.reply(start_service.success);  
    }
  })

  bot.on('channel_post', async ctx => {
    const text = ctx.update.channel_post.text;
    const admins = await ctx.getChatAdministrators(ctx.update.channel_post.chat.id);
    const userActiveSessionId = admins.filter(item => existsSession(item.user.id));
    
    const userID = userActiveSessionId.length > 0 
      ? userActiveSessionId[0].user.id
      : undefined;
      
    const { id: chatID, title } = await ctx.getChat();
    if (userID) add(String(userID), title, String(chatID));

    if (text === '/start_service') {
      if ((await isBotAdmin(ctx))) {
        ctx.reply(start_service.success);
      }
    }
  })

  setupFeedActions(bot, initMarkup, chatRepository);
}
