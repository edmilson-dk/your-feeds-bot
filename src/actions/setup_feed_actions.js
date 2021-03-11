const { home } = require('../messages/commands')
const { start_bot_keyboard, go_back_btn, clicked_chat } = require('../messages/inline_keyboard')
const { getChatId, getUserId } = require('../helpers/bot_helpers')
const { homeMarkup } = require('../markups');
const ChatRepository = require('../infra/repositories/chat_repository');
const { listChats } = require('../helpers/features_helpers');

const { manager_feeds, add_super_chat } = start_bot_keyboard;

const chatRepository = new ChatRepository();

module.exports = ({ bot }) => {
  bot.action('start_bot', ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    ctx.telegram.sendMessage(getChatId(ctx), home.text, homeMarkup);
  }) 

  bot.action('manager_feeds', async ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
   
    const userID = getUserId(ctx, 'action');
    const chatsList = await listChats(chatRepository, userID);
    
    const defaultMarkup = [
      [{ text: manager_feeds.action_update_list, callback_data: 'manager_feeds'},
      { text: manager_feeds.action_super_chat, callback_data: 'action_super_chat'}],
      [{ text: go_back_btn.text, callback_data: 'start_bot' }],
    ]

    ctx.telegram.sendMessage(getChatId(ctx), `${manager_feeds.action_text}\n\n${chatsList}`, {
      reply_markup: {
        inline_keyboard: defaultMarkup, 
      },
      parse_mode: 'HTML'
    })
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
