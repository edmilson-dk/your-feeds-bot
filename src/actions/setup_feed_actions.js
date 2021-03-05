const { start_bot, home } = require('../messages/commands')
const { start_bot_keyboard, go_back_btn } = require('../messages/inline_keyboard')
const { getChatId, getUserId } = require('../helpers/bot_helpers')

const { manager_feed, add_super_chat } = start_bot_keyboard;

module.exports = (bot, initMarkup, chatRepository) => {
  bot.action('start_bot', ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    ctx.telegram.sendMessage(getChatId(ctx), home.text, initMarkup);
  }) 

  bot.action('manager_feed', async ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
   
    const userID = getUserId(ctx, 'action');
    const chats = await chatRepository.getAllChatOfUser(String(userID));
    
    const defaultMarkup = [
      [{ text: manager_feed.action_update_list, callback_data: 'update_list_chats'},
      { text: manager_feed.action_super_chat, callback_data: 'action_super_chat'}],
      [{ text: go_back_btn.text, callback_data: 'start_bot' }]
    ]

    const chatsKeyBoard = [];

    if (chats.length > 0) {
      chats.forEach(chat => {
        chatsKeyBoard.push([
          { text: chat.title, callback_data: chat.id }
        ]);
      })
    }

    defaultMarkup.forEach(markup => chatsKeyBoard.push(markup));

    ctx.telegram.sendMessage(getChatId(ctx), manager_feed.action_text, {
      reply_markup: {
        inline_keyboard: chatsKeyBoard, 
      }
    })
  })

  bot.action('action_super_chat', ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();

    ctx.telegram.sendMessage(getChatId(ctx), add_super_chat.text, {
      reply_markup: {
        inline_keyboard: [
          [{ text: go_back_btn.text, callback_data: 'manager_feed' }]
        ]
      }
    })
  })

  bot.on('callback_query', ctx => {
    console.log(ctx);
  })
}
