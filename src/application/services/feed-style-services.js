const FeedStyleUseCaseInterface = require("../../domain/use-cases/feed-style-usecase");

class FeedStyleServices extends FeedStyleUseCaseInterface {
  constructor({ feedStyleRepository }) {
    super();

    this._feedStyleRepository = feedStyleRepository;
    
    Object.freeze(this);
  }

  async addStyles(data, chatId) {
    await this._feedStyleRepository.addStyles(data, chatId);

    return;
  }

  async getStyles({ chatId }) {
    const feedStyle = await this._feedStyleRepository.getStyles({ chatId });

    return feedStyle;
  }

  async updateStyles(data, chatId) {
    await this._feedStyleRepository.updateStyles(data, chatId);
    
    return;
  }

  async existsFeedStyles({ chatId }) { 
    const exists = await this._feedStyleRepository.existsFeedStyles({ chatId });
    
    return exists;
  }
}

module.exports = FeedStyleServices;