const { start_bot, home } = require('../messages/commands')
const { start_bot_keyboard, go_back_btn, clicked_chat } = require('../messages/inline_keyboard')
const { getChatId, getUserId } = require('../helpers/bot_helpers')
const { homeMarkup, timezonesMarkup } = require('../markups');

const { manager_feeds, add_super_chat } = start_bot_keyboard;

module.exports = ({bot, chatRepository}) => {
  bot.action('start_bot', ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    ctx.telegram.sendMessage(getChatId(ctx), home.text, homeMarkup);
  }) 

  bot.action('manager_feeds', async ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
   
    const userID = getUserId(ctx, 'action');
    const chats = await chatRepository.getAllChatOfUser(String(userID));
    
    const defaultMarkup = [
      [{ text: manager_feeds.action_update_list, callback_data: 'manager_feeds'},
      { text: manager_feeds.action_super_chat, callback_data: 'action_super_chat'}],
      [{ text: go_back_btn.text, callback_data: 'start_bot' }]
    ]

    const chatsKeyBoard = [];

    if (chats.length > 0) {
      chats.forEach(chat => {
        chatsKeyBoard.push([
          { text: chat.title, callback_data: 'clicked_in_chat'}
        ]);
      })
    }

    defaultMarkup.forEach(markup => chatsKeyBoard.push(markup));

    ctx.telegram.sendMessage(getChatId(ctx), manager_feeds.action_text, {
      reply_markup: {
        inline_keyboard: chatsKeyBoard, 
      }
    })
  })

  bot.action('clicked_in_chat', ctx => {
    ctx.answerCbQuery(
      clicked_chat.text,
      ctx.update.callback_query.id);
  })

  bot.action('action_super_chat', ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();

    ctx.telegram.sendMessage(getChatId(ctx), add_super_chat.text, {
      reply_markup: {
        inline_keyboard: [
          [{ text: go_back_btn.text, callback_data: 'manager_feeds' }]
        ]
      }
    })
  })
}
