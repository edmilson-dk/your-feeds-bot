const { start_bot_keyboard } = require('../messages/inline_keyboard');

const { manager_feeds, help, about } = start_bot_keyboard;

const homeMarkup =  {
  reply_markup: {
    inline_keyboard: [
      [{ text: help.text, callback_data: 'help'}, {text: about.text, callback_data: 'about' }],
      [{ text: manager_feeds.text, callback_data: 'manager_feeds'}],
    ],
  },
}

const timezonesMarkup = {
  reply_markup: {
    inline_keyboard: [
      [{ text: 'Ver tabela de fusos horários', url: "https://fusohorariomundial.com.br/tabela"}]
    ]
  }
}

module.exports = {
  homeMarkup,
  timezonesMarkup,
}