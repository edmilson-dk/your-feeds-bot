const { start_bot, start_service } = require('../messages/commands.json');
const { start_bot_keyboard } = require('../messages/inline_keyboard.json');
const { 
  getChatId,
  isBotAdmin
} = require('../helpers/bot_helpers');

const setupFeedActions = require('../actions/setup_feed_actions');

const { setup_feed, help } = start_bot_keyboard;

module.exports = bot => {
  const initMarkup =  {
    reply_markup: {
      inline_keyboard: [
        [{ text: help.text, callback_data: 'help'}],
        [{ text: setup_feed.text, callback_data: 'setup_feed'}],
      ],
    },
  }

  bot.start(async ctx => {
    const { type } = await ctx.getChat();
 
    type === 'private' 
      ? ctx.telegram.sendMessage(getChatId(ctx), start_bot.text, initMarkup)
      : ctx.telegram.sendMessage(getChatId(ctx), 'Olá!');  
  })

  bot.command('start_service', async ctx => {
    const { type } = await ctx.getChat();
    
    if (type !== 'private') {
      ctx.reply(start_service.text);
    }
  })

  bot.on('channel_post', async ctx => {
    const chat = await ctx.getChat();
    const text = ctx.update.channel_post.text;
    
    if (text === '/start_service') {
      ctx.reply(start_service.text);
    }
  })

  setupFeedActions(bot, initMarkup);
}
