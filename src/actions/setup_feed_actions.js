const { start_bot } = require('../messages/commands.json');
const { start_bot_keyboard, go_back_btn } = require('../messages/inline_keyboard.json');
const { getChatId } = require('../helpers/bot_helpers');

const { setup_feed, add_super_chat } = start_bot_keyboard;

module.exports = (bot, initMarkup) => {
  bot.action('start_bot', ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    ctx.telegram.sendMessage(getChatId(ctx), start_bot.text, initMarkup);
  }) 

  bot.action('setup_feed', ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();

    ctx.telegram.sendMessage(getChatId(ctx), setup_feed.action_text, {
      reply_markup: {
        inline_keyboard: [
          [{ text: setup_feed.action_super_chat, callback_data: 'action_super_chat'}],
          [{ text: setup_feed.action_private_chat, callback_data: 'action_private_chat' }],
          [{ text: go_back_btn.text, callback_data: 'start_bot' }]
        ]
      }
    })
  })

  bot.action('action_super_chat', ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();

    ctx.telegram.sendMessage(getChatId(ctx), add_super_chat.text, {
      reply_markup: {
        inline_keyboard: [
          [{ text: go_back_btn.text, callback_data: 'setup_feed' }]
        ]
      }
    })
  })
}
