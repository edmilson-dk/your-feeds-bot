const { init_cmd } = require('../messages/commands.json');
const { init_btn } = require('../messages/inline_keyboard.json');
const {
  getChatId,
} = require('../helpers/command_help');

module.exports = bot => {
  bot.command('init', async ctx => {
    const { type } = await ctx.getChat();

    if (type === 'private') {
      ctx.telegram.sendMessage(getChatId(ctx), init_cmd.text, {
        reply_markup: {
          inline_keyboard: [
            [{ text: init_btn.help.text, callback_data: 'help'}],
            [{ text: init_btn.add_feed.text, callback_data: 'add_feed'}],
          ]
        }
      });
    }
  })
}
