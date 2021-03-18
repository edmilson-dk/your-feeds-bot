require('dotenv').config();

const Bot = require('./drivers/bot');
const createBot = require('./drivers/telegraf-bot/telegraf-api');

const Core = require('./core');
const Commands = require('./commands');

const bot = new Bot({
  token: process.env.BOT_TOKEN,
  createBot: createBot,
}).init();

const core = new Core({ bot }).init();
const commands = new Commands({ bot })

(async () => {
  commands.init();
  await core.init();
})();

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
