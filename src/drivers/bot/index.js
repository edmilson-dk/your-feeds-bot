class Bot {
  constructor({ token, createBot }) {
    this._token = token;
    this._createBot = createBot;

    Object.freeze(this);
  }

  init() {
    const bot = this._createBot({ token: this._token });
    return bot;
  }
}

module.exports = Bot;