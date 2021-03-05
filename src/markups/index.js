const { start_bot_keyboard } = require('../messages/inline_keyboard');

const { manager_feed, help, about } = start_bot_keyboard;

export const homeMarkup =  {
  reply_markup: {
    inline_keyboard: [
      [{ text: help.text, callback_data: 'help'}, {text: about.text, callback_data: 'about' }],
      [{ text: manager_feed.text, callback_data: 'manager_feed'}],
    ],
  },
}
export const timezonesMarkup = {
  reply_markup: {
    inline_keyboard: [
      [{ text: 'Ver tabela de timezones', url: "https://pt.wikipedia.org/wiki/Lista_de_fusos_hor%C3%A1rios"}]
    ]
  }
}