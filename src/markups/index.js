const { start_bot_keyboard, go_back_btn } = require('../messages/inline_keyboard');

const { manager_feeds, help, about } = start_bot_keyboard;

const homeMarkup =  {
  reply_markup: {
    inline_keyboard: [
      [{ text: help.text, callback_data: 'help'}, {text: about.text, callback_data: 'about' }],
      [{ text: manager_feeds.text, callback_data: 'manager_feeds'}],
    ],
  },
  parse_mode: 'HTML'
}

const timezonesMarkup = {
  reply_markup: {
    inline_keyboard: [
      [{ text: 'Ver tabela de fusos horários', url: "https://fusohorariomundial.com.br/tabela"}]
    ]
  },
  parse_mode: 'HTML'
}

const isNotMemberOrAdmin = {
  reply_markup: {
    inline_keyboard: [
      [{ text: go_back_btn.text, callback_data: 'start_bot'}]
    ]
  },
  parse_mode: 'HTML'
}

module.exports = {
  homeMarkup,
  timezonesMarkup,
  isNotMemberOrAdmin
}