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

const isNotMemberOrAdminMarkup = {
  reply_markup: {
    inline_keyboard: [
      [{ text: go_back_btn.text, callback_data: 'start_bot'}]
    ]
  },
  parse_mode: 'HTML'
}

const goBackManagerFeedsMarkup = {
  reply_markup: {
    inline_keyboard: [
      [{ text: go_back_btn.text, callback_data: 'manager_feeds' }],
    ]
  },
  parse_mode: 'HTML'
}

const goBackViewChatCmd = {
  reply_markup: {
    inline_keyboard: [
      [{ text: go_back_btn.text, callback_data: 'view_chat' }],
    ]
  },
  parse_mode: 'HTML'
}

const setStylesFeedsMarkup = {
  reply_markup: {
    inline_keyboard: [
      [{ text: 'Titúlo 🎨', callback_data: 'style_title' }],
      [{ text: 'Descrição 🎨', callback_data: 'style_description' }],
      [{ text: 'Conteúdo 🎨', callback_data: 'style_content' }],
      [{ text: go_back_btn.text, callback_data: 'view_chat' }],
    ]
  },
  parse_mode: 'HTML'
}

const setStylesTitleFeedsMarkup = {
  reply_markup: {
    inline_keyboard: [
      [{ text: 'Itálico 🔴', callback_data: 'title_italic'}, { text: 'Negrito 🔴', callback_data: 'title_bold'}],
      [{ text: 'Monospace 🔴', callback_data: 'title_mono'}, { text: 'Padrão 🔴', callback_data: 'title_default'}],
      [{ text: go_back_btn.text, callback_data: 'view_chat' }],
    ]
  },
  parse_mode: 'HTML'
}

const setStylesDescriptionFeedsMarkup = {
  reply_markup: {
    inline_keyboard: [
      [{ text: 'Itálico 🔴', callback_data: 'description_italic'}, { text: 'Negrito 🔴', callback_data: 'description_bold'}],
      [{ text: 'Monospace 🔴', callback_data: 'description_mono'}, { text: 'Padrão 🔴', callback_data: 'description_default'}],
      [{ text: go_back_btn.text, callback_data: 'view_chat' }],
    ]
  },
  parse_mode: 'HTML'
}

const setStylesContentFeedsMarkup = {
  reply_markup: {
    inline_keyboard: [
      [{ text: 'Itálico 🔴', callback_data: 'content_italic'}, { text: 'Negrito 🔴', callback_data: 'content_bold'}],
      [{ text: 'Monospace 🔴', callback_data: 'content_mono'}, { text: 'Padrão 🔴', callback_data: 'content_default'}],
      [{ text: go_back_btn.text, callback_data: 'view_chat' }],
    ]
  },
  parse_mode: 'HTML'
}

module.exports = {
  homeMarkup,
  timezonesMarkup,
  isNotMemberOrAdminMarkup,
  goBackManagerFeedsMarkup,
  setStylesFeedsMarkup,
  setStylesTitleFeedsMarkup,
  setStylesContentFeedsMarkup,
  setStylesDescriptionFeedsMarkup,
  goBackViewChatCmd
}