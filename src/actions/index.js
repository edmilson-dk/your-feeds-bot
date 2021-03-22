const { home } = require('../messages/commands');
const { start_bot_keyboard, go_back_btn } = require('../messages/inline_keyboard');
const { getChatId, getUserId, finishedViewChatCmd } = require('../helpers/bot_helpers');
const { homeMarkup, setStylesContentFeedsMarkup, setStylesDescriptionFeedsMarkup, setStylesTitleFeedsMarkup } = require('../markups');
const { listChats } = require('../helpers/features_helpers');

const chatServices = require('../infra/adapters/chat-adapter');

const { manager_feeds, add_super_chat, about, help } = start_bot_keyboard;

module.exports = ({ bot }) => {
  bot.action('start_bot', ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    ctx.telegram.sendMessage(getChatId(ctx), home.text, homeMarkup);
  }) 

  function aboutAndHelpMessage(ctx, message) {
    ctx.answerCbQuery();
    ctx.deleteMessage();

    ctx.telegram.sendMessage(getChatId(ctx), message, {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Acessar meu grupo', url: process.env.BOT_CHAT }],
          [{ text: go_back_btn.text, callback_data: 'start_bot' }]
        ]
      },
      parse_mode: 'HTML'
    });
  }

  bot.action('about', ctx => {
    aboutAndHelpMessage(ctx, about.message);
  })

  bot.action('help', ctx => {
    aboutAndHelpMessage(ctx, help.message);
  })

  bot.action('manager_feeds', async ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
   
    const userId = getUserId(ctx, 'action');
    await chatServices.setNotActiveConfigChats({ userId });
    const chats = await chatServices.getAllChatsOfUser({ userId });
    
    const chatsList = await listChats(chats);
    
    const defaultMarkup = [
      [{ text: manager_feeds.action_update_list, callback_data: 'manager_feeds'},
      { text: manager_feeds.action_super_chat, callback_data: 'action_super_chat'}],
      [{ text: go_back_btn.text, callback_data: 'start_bot' }],
    ];

    ctx.telegram.sendMessage(getChatId(ctx), `${manager_feeds.action_text}\n\n${chatsList}`, {
      reply_markup: {
        inline_keyboard: defaultMarkup, 
      },
      parse_mode: 'HTML'
    });
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
    });
  })

  bot.action('view_chat', async ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();

    const userId = ctx.update.callback_query.from.id;
    const chatId = await chatServices.getIsActiveConfigChat({ userId });

    const message = await finishedViewChatCmd(ctx, chatId);
    ctx.telegram.sendMessage(...message);
  })

  bot.action('style_title', ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();

    ctx.telegram.sendMessage(getChatId(ctx), 'Escolha um estilo para os titúlos abaixo 📌', setStylesTitleFeedsMarkup);
  })

  bot.action('style_description', ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();

    ctx.telegram.sendMessage(getChatId(ctx), 'Escolha um estilo para as descrições abaixo 📌', setStylesDescriptionFeedsMarkup);
  })

  bot.action('style_content', ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();

    ctx.telegram.sendMessage(getChatId(ctx), 'Escolha um estilo para os conteúdos abaixo 📌', setStylesContentFeedsMarkup);
  })
}