class FeedStyleRepositoryInterface {
  addStyles(data, chatId) {
    throw new Error('Not implemented method');
  }

  getStyles({ chatId }) {
    throw new Error('Not implemented method');
  }

  updateStyles(data, chatId) {
    throw new Error('Not implemented method');
  }

  existsFeedStyles({ chatId }) {
    throw new Error('Not implemented method');
  }
}

module.exports = FeedStyleRepositoryInterface;