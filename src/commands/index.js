const { init_cmd } = require('../messages/commands.json');
const { init_btn, go_back_btn } = require('../messages/inline_keyboard.json');
const { setup_feed, help, add_super_chat, add_bot } = init_btn;

const {
  getChatId,
} = require('../helpers/command_help');

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

  bot.action('init_menu', ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    ctx.telegram.sendMessage(getChatId(ctx), init_cmd.text, initMarkup);
  }) 

  bot.action('setup_feed', ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();

    ctx.telegram.sendMessage(getChatId(ctx), setup_feed.action_text, {
      reply_markup: {
        inline_keyboard: [
          [{ text: setup_feed.action_super_chat, callback_data: 'action_super_chat'}],
          [{ text: setup_feed.action_private_chat, callback_data: 'action_private_chat' }],
          [{ text: go_back_btn.text, callback_data: 'init_menu' }]
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

