class FeedUseCaseInterface {
  addFeed({ rssUrl, hashtag, title, chatId }) {
    throw new Error('Not implemented method');
  }

  getFeeds({ chatId }) {
    throw new Error('Not implemented method');
  }

  ownThisChat({ chatId }) {
    throw new Error('Not implemented method');
  }

  dropFeedByTitle({ title, chatId }) {
    throw new Error('Not implemented method');
  } 

  existsFeedByTitle({ title, chatId }) {
    throw new Error('Not implemented method');
  }
}

module.exports = FeedUseCaseInterface;