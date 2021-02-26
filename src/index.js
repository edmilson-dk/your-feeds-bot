require('dotenv').config();
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(ctx => {
  ctx.telegram.sendMessage(ctx.chat.id, 'Olá! digite o comando /init para ver meu menu de opções.');
})

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
