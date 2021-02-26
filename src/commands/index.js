const { init_cmd, start_service } = require('../messages/commands.json');
const { init_btn } = require('../messages/inline_keyboard.json');
const { 
  getChatId,
  isBotAdmin
} = require('../helpers/bot_helpers');

const setupFeedActions = require('../actions/setup_feed_actions');

const { setup_feed, help } = init_btn;

module.exports = bot => {
  const initMarkup =  {
    reply_markup: {
      inline_keyboard: [
        [{ text: help.text, callback_data: 'help'}],
        [{ text: setup_feed.text, callback_data: 'setup_feed'}],
      ],
    },
  }

  bot.command('init', async ctx => {
    const { type } = await ctx.getChat();

    if (type === 'private') {
      ctx.telegram.sendMessage(getChatId(ctx), init_cmd.text, initMarkup);   
    }
  })

  bot.command('start_service', async ctx => {
    const { type } = await ctx.getChat();
    
    if (type !== 'private') {
      ctx.reply(start_service.text);
    }
  })

  setupFeedActions(bot, initMarkup);
}
