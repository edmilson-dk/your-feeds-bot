const { Telegraf } = require('telegraf');

function createBot({ token }) {
  const bot = new Telegraf(token);
  return bot;
}

module.exports = createBot;