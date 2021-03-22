const { goBackManagerFeedsMarkup,} = require('../markups');
const { start_bot_keyboard, go_back_btn } = require('../messages/inline_keyboard.json');
const { view_chat } = require('../messages/commands.json');
const { listFeeds, listChats } = require('./features_helpers');
const chatServices = require("../infra/adapters/chat-adapter");
const feedServices = require("../infra/adapters/feed-adapter");

const { manager_feeds } = start_bot_keyboard;

const getChatId = (ctx) => ctx.chat.id;

async function isAdmin(memberId, ctx) {
  const { status } = await ctx.getChatMember(memberId);
  const result = status === 'creator' || status === 'administrator';

  return result;
}

async function isStillMemberAndAdmin(chatId, memberId, { bot }) {
  try {
    const { status } = await bot.telegram.getChatMember(chatId, memberId);
    const result = status === 'creator' || status === 'administrator';

    return result;
  } catch (err) {
    return false;
  }
}

async function isBotAdmin(ctx){
  const botId = ctx.botInfo.id;
  const result = await isAdmin(botId, ctx);

  return result;
}

function getUserId(ctx, type) {
  switch (type) {
    case 'action':
      return ctx.update.callback_query.from.id; 
    case 'command':
      return ctx.from.id;
  }
}

function removeCommand(message, command) {
  const newMessage = message.replace(command, '').trim();
  return newMessage;
}

async function finishedViewChatCmd(ctx, chatId ) {
  const allFeeds = await feedServices.getFeeds({ chatId });
  const feedsList = await listFeeds(allFeeds);

  return [
    getChatId(ctx), 
    `${view_chat.text}\n\n${feedsList}`, 
    goBackManagerFeedsMarkup
  ];
}

async function finishedManagerChatCmd(ctx, userId ) {
  const allChats = await chatServices.getAllChatsOfUser({ userId });
  
  const chatsList = await listChats(allChats);

  return [
    getChatId(ctx), 
    `${manager_feeds.action_text}\n\n${chatsList}`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: go_back_btn.text, callback_data: 'start_bot' }]
        ]
      },
      parse_mode: 'HTML'
    }
  ];
}

module.exports = {
  isAdmin,
  isBotAdmin,
  getChatId,
  getUserId,
  isStillMemberAndAdmin,
  removeCommand,
  finishedViewChatCmd,
  finishedManagerChatCmd
};