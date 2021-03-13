const createBot = require("./telegraf-api");

class Bot {
  constructor({ token }) {
    this._token = token;

    Object.freeze(this);
  }

  init() {
    const bot = createBot({ token: this._token });
    return bot;
  }
}

module.exports = Bot;