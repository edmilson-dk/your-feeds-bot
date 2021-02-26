require('dotenv').config();
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

const commands = require('./commands');

bot.start(async ctx => {
  const { type } = await ctx.getChat();
 
  type === 'private' 
    ? ctx.telegram.sendMessage(ctx.chat.id, 'Olá! digite o comando /init para ver meu menu de opções.')
    : ctx.telegram.sendMessage(ctx.chat.id, 'Olá!');  
})

commands(bot);

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
