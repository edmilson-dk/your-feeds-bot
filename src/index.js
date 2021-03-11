require('dotenv').config();

const { Telegraf } = require('telegraf');
const init = require('./core');
const bot = new Telegraf(process.env.BOT_TOKEN);

const commands = require('./commands');

commands(bot);
setTimeout(async () => await init(bot), 0);

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
