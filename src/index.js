require('dotenv').config();

const Bot = require('./drivers/bot');
const createBot = require('./drivers/telegraf-bot/telegraf-api');

const Core = require('./core');
const Commands = require('./commands');

const bot = new Bot({
  token: process.env.BOT_TOKEN,
  createBot: createBot,
}).init();

new Core({ bot }).init();
new Commands({ bot }).init();

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));