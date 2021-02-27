const { start_bot, start_service } = require('../messages/commands.json');
const { start_bot_keyboard } = require('../messages/inline_keyboard.json');

const { getChatId, isBotAdmin, isAdmin } = require('../helpers/bot_helpers');
const { add, drop, addSession, existsSession } = require('../drivers/database/in-memory-database');

const setupFeedActions = require('../actions/setup_feed_actions');

const { manager_feed, help } = start_bot_keyboard;

module.exports = bot => {
  const initMarkup =  {
    reply_markup: {
      inline_keyboard: [
        [{ text: help.text, callback_data: 'help'}],
        [{ text: manager_feed.text, callback_data: 'manager_feed'}],
      ],
    },
  }

  bot.start(async ctx => {
    const { type } = await ctx.getChat();
    const existsUserId = existsSession(ctx.message.from.id);
    
    if (!existsUserId) addSession(ctx.message.from.id);
 
    type === 'private' 
      ? ctx.telegram.sendMessage(getChatId(ctx), start_bot.text, initMarkup)
      : ctx.telegram.sendMessage(getChatId(ctx), 'Olá!');  
  })

  bot.command('start_service', async ctx => {
    const { type, id: chatID, title } = await ctx.getChat();
    const userID = ctx.message.from.id;
    const isUserAdmin = await isAdmin(userID, ctx);
    const isUserValid = existsSession(userID);

    if (type !== 'private') {
      if (!isUserValid) {
        ctx.reply(start_service.not_bot_admin);
        return;
      }
      if (isUserValid && !(await isBotAdmin(ctx))) {
        ctx.reply(start_service.invalid_user);
        return;
      }
      if (isUserValid && !isUserAdmin) {
        ctx.reply(start_service.not_admin);
        return;
      }

      add(String(userID), title, String(chatID));
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

  setupFeedActions(bot, initMarkup);
}
