const { 
  start_service, home, cmd_error, 
  not_member_admin, view_chat, 
  add_feed, remove_feed, active_feed,
  command_error, not_found_chat
} = require('../../messages/commands');
const { homeMarkup, isNotMemberOrAdminMarkup, goBackManagerFeedsMarkup } = require('../../markups');
const { start_bot_keyboard, go_back_btn } = require('../../messages/inline_keyboard');
const { getChatId, isBotAdmin, isAdmin, isStillMemberAndAdmin, removeCommand } = require('../../helpers/bot_helpers');
const { asyncFilter, isHashtagsValid, removeSpacesInArray, removeNotHashtagsInArray, listFeeds, listChats } = require('../../helpers/features_helpers');


const { manager_feeds } = start_bot_keyboard;
const RssParser = require('../../drivers/rss-parser');

const userServices = require('../../infra/adapters/user-adapter');
const chatServices = require('../../infra/adapters/chat-adapter');
const feedServices = require('../../infra/adapters/feed-adapter');

const rssParser = new RssParser();

async function isValidSessionToSendCommand(userId, userValidate = false) {
  const existsUser = await userServices.existsUser({ userId });
  const existsChat = await chatServices.containsActiveChatConfig({ userId });

  if (!existsUser) return false;
  if (!existsChat && !userValidate) return false;

  return true;
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
  console.log(allChats)
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

async function startBotCommand(ctx) {
  const { type } = await ctx.getChat();
  const userId = ctx.from.id;
  const username = ctx.from.username;

  if (type === 'private') {
    await chatServices.setNotActiveConfigChats({ userId });
    
    if (!(await userServices.existsUser({ userId }))) {
      await userServices.addUser({ userId, username });
    }

    ctx.telegram.sendMessage(getChatId(ctx), home.text, homeMarkup);
    return;
  } else {
    ctx.telegram.sendMessage(getChatId(ctx), 'Olá!'); 
    return;
  }
}

async function startServiceCommand(ctx) {
  const { type, id: chatId, title } = await ctx.getChat();
  const userId = ctx.from.id;

  const isUserAdmin = await isAdmin(userId, ctx);
  const isUserValid = await userServices.existsUser({ userId });
  
  if (type !== 'private') {
    if (!isUserValid) {
      ctx.reply(start_service.invalid_user);
      return;
    }
    if (isUserValid && !(await isBotAdmin(ctx))) {
      ctx.reply(start_service.not_bot_admin);
      return;
    }
    if (isUserValid && !isUserAdmin) {
      ctx.reply(start_service.not_admin);
      return;
    }
    if ((await chatServices.existsChat({ chatId }))) {
      ctx.reply(start_service.chat_alredy_exists);
      return;
    } 

    await chatServices.addChat({ id: chatId, title, userId});
    ctx.reply(start_service.success); 

    return;
  }

  return;
}

async function startServiceEvent(ctx) {
  const text = ctx.update.channel_post.text;
  const admins = await ctx.getChatAdministrators(ctx.update.channel_post.chat.id);
  const notMemberBot = admins.filter(item => !item.user.is_bot);

  const userActiveSessionId = await asyncFilter(notMemberBot, async item => {
    const exists = await userServices.existsUser({ userId: item.user.id });
    return exists;
  });

  const userId = userActiveSessionId.length > 0 
    ? userActiveSessionId[0].user.id
    : undefined;
    
  const { id: chatId, title } = await ctx.getChat();
  let chat = null;
  
  if (userId) chat = { id: chatId, title, userId };
  
  if (text === '/start_service') { 
    if ((await isBotAdmin(ctx)) && chat) {
      await chatServices.addChat(chat);
      ctx.reply(start_service.success);  

      return;
    }
    if ((await chatServices.existsChat({ chatId }))) {
      ctx.reply(start_service.chat_alredy_exists);
      return;
    } 
  }

  return;
}

async function viewChatCommand(ctx, bot) {
  const userId = ctx.message.from.id;
  const chatTitle = removeCommand(ctx.message.text,'/view_chat');
 
  if (!chatTitle) {
    ctx.reply(cmd_error.text);
    return;
  }

  const chat = await chatServices.getUserChatByTitle({ userId, chatTitle });

  if (chat.length === 0) {
    ctx.reply(not_found_chat.message);
    return;
  }

  const { id: chatId } = chat;

  if ((await isStillMemberAndAdmin(chatId, userId, { bot }))) {   
    await chatServices.setActiveConfigChat({ chatId, userId, state: true });

    const message = await finishedViewChatCmd(ctx, chatId);
    ctx.telegram.sendMessage(...message);

    return;
  } else {
    ctx.telegram.sendMessage(userId, not_member_admin.text, isNotMemberOrAdminMarkup);
    await chatServices.dropChat({ userId, chatId });

    return;
  }
}

async function addFeedCommand(ctx) {
  const userId = ctx.message.from.id;

  if (!(await isValidSessionToSendCommand(userId))) {
    ctx.reply(command_error.message);
    return;
  }

  let data = removeCommand(ctx.message.text, '/add').split(' ');
  data = removeSpacesInArray(data);

  const rssUrl = data.slice(0, 1).toString();
  const hashtags = removeNotHashtagsInArray(data);

  if (hashtags.length > 3) {
    ctx.telegram.sendMessage(getChatId(ctx), add_feed.max_hashtags);
    return;
  }

  if (!isHashtagsValid(hashtags)) {
    ctx.telegram.sendMessage(getChatId(ctx), add_feed.cmd_error, { parse_mode: 'HTML'});
    return;
  } 
  
  if ((await rssParser.rssIsValid(rssUrl))) {
    const title = await rssParser.getFeedTitle(rssUrl);
    const hashtags_formatted = hashtags.join(' ');

    const chatId = await chatServices.getIsActiveConfigChat({ userId });
   
    if ((await feedServices.existsFeedByTitle({ title, chatId }))) {
      ctx.reply(add_feed.alredy_exists);
      return;
    }

    await feedServices.addFeed({ rssUrl, hashtag: hashtags_formatted, title, chatId });

    ctx.reply(add_feed.success);
    const message = await finishedViewChatCmd(ctx, chatId);
    ctx.telegram.sendMessage(...message);

    return;
  } else {
    ctx.reply(add_feed.invalid_rss);
    return;
  }
}

async function removeFeedCommand(ctx) {
  const userId = ctx.message.from.id;

  if (!(await isValidSessionToSendCommand(userId))) {
    ctx.reply(command_error.message);
    return;
  }

  const feedTitle = removeCommand(ctx.message.text, '/remove');

  const chatId = await chatServices.getIsActiveConfigChat({ userId });

  if (!feedTitle) {
    ctx.telegram.sendMessage(getChatId(ctx), remove_feed.cmd_error, { parse_mode: 'HTML'});
    return;
  }
  if (!(await feedServices.existsFeedByTitle({ title: feedTitle, chatId }))) {
    ctx.telegram.sendMessage(getChatId(ctx), remove_feed.invalid_title, { parse_mode: 'HTML'});
    return;
  }

  await feedServices.dropFeedByTitle({ title: feedTitle, chatId });

  ctx.reply(remove_feed.success);
  const message = await finishedViewChatCmd(ctx, chatId);
  ctx.telegram.sendMessage(...message);

  return;
}

async function activeChatCommand(ctx) {
  const userId = ctx.message.from.id;

  if (!(await isValidSessionToSendCommand(userId))) {
    ctx.reply(command_error.message);
    return;
  }

  const chatId = await chatServices.getIsActiveConfigChat({ userId });

  if (!(await feedServices.ownThisChat({ chatId }))) {
    ctx.reply(active_feed.error);
    return;
  }

  await chatServices.updateActiveChat({ isActive: true, chatId });
  await chatServices.setActiveConfigChat({ chatId, userId, state: false });

  ctx.reply(active_feed.success);
  const message = await finishedViewChatCmd(ctx, chatId);
  ctx.telegram.sendMessage(...message);

  return;
}

async function removeChatCommand(ctx) {
  const userId = ctx.message.from.id;

  if (!(await isValidSessionToSendCommand(userId, true))) {
    ctx.reply(command_error.message);
    return;
  }
  const chatTitle = removeCommand(ctx.message.text, '/remove_chat');
  
  if (!chatTitle) {
    ctx.reply(cmd_error.text);
    return;
  }

  const row = await chatServices.getUserChatByTitle({ userId, chatTitle });
  
  if (!row) {
    ctx.reply('⚠️ Chat não encontrado, certifique-se de ter escrito o nome do chat conforme a listagem acima.');
    return;
  }

  const { id, title } = row;

  await chatServices.dropChat({ userId, chatId: id });

  setTimeout(async () => {
    ctx.reply(`✅ O chat (${title})foi removido com sucesso.`);
    const message = await finishedManagerChatCmd(ctx, userId);
    ctx.telegram.sendMessage(...message);
  }, 500);
}

module.exports = {
  startBotCommand,
  startServiceCommand,
  startServiceEvent,
  viewChatCommand,
  addFeedCommand,
  removeFeedCommand,
  activeChatCommand,
  removeChatCommand,
}