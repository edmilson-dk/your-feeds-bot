const { start_bot, start_service, home, cmd_error} = require('../messages/commands');
const { homeMarkup, timezonesMarkup } = require('../markups');
const { getChatId, isBotAdmin, isAdmin } = require('../helpers/bot_helpers');

const User = require('../domain/User');
const Feed = require('../domain/Feed');
const Chat = require('../domain/Chat');

const UserRepository = require('../infra/repositories/user_repository');
const ChatRepository = require('../infra/repositories/chat_repository');
const FeedRepository = require('../infra/repositories/feed_repository');

const setupFeedActions = require('../actions/setup_feed_actions');

const userRepository = new UserRepository();
const chatRepository = new ChatRepository();
const feedRepository = new FeedRepository();

module.exports = bot => {

  bot.start(async ctx => {
    const { type } = await ctx.getChat();

    type === 'private'
      ? ctx.telegram.sendMessage(getChatId(ctx), start_bot.text, timezonesMarkup)
      : ctx.telegram.sendMessage(getChatId(ctx), 'Olá!');  
  })

  bot.command('register', async ctx => {
    const [, timezone] = ctx.message.text.split(' ');

    if (!timezone) {
      ctx.reply(cmd_error.text);
      return;
    }

    const user = new User(ctx.from.id, ctx.from.username, timezone);
    await userRepository.add(user.user_id, user.username, user.timezone);
    
    ctx.telegram.sendMessage(getChatId(ctx), home.text, homeMarkup);
  })

 bot.command('start_service', async ctx => {
    const { type, id: chatID, title } = await ctx.getChat();
    const userID = ctx.from.id;
    const isUserAdmin = await isAdmin(userID, ctx);
    const isUserValid = await userRepository.existsUser(String(userID));
    const chat = new Chat(chatID, title, userID);
    
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
      if ((await chatRepository.existsChat(chatID))) {
        ctx.reply('Este chat já está registrado em meu sistema!');
        return;
      } 

      await chatRepository.addChat(
        chat.id,
        chat.title,
        chat.user_id,
        chat.interval_post,
        chat.start_posts,
        chat.end_posts,
        chat.next_posts_time
      );
      console.log(await chatRepository.getOneChatOfUser(userID, chatID));
      ctx.reply(start_service.success);  
    }
  })

  bot.on('channel_post', async ctx => {
    const text = ctx.update.channel_post.text;
    const admins = await ctx.getChatAdministrators(ctx.update.channel_post.chat.id);
    const userActiveSessionId = admins.filter(item => existsSession(item.user.id));
    
    const userID = userActiveSessionId.length > 0 
      ? userActiveSessionId[0].user.id
      : undefined;
      
    const { id: chatID, title } = await ctx.getChat();
    if (userID) add(String(userID), title, String(chatID));

    if (text === '/start_service') {
      if ((await isBotAdmin(ctx))) {
        ctx.reply(start_service.success);
      }
    }
  })

  setupFeedActions(bot, chatRepository);
}