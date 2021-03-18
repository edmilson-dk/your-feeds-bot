const Feed = require("../../domain/entities/Feed");
const FeedUseCaseInterface = require("../../domain/use-cases/feed-usecase-interface");
const { formatToString } = require("../../helpers/features_helpers");

class FeedServices extends FeedUseCaseInterface {
  constructor({ feedRepository }) {
    super();
    
    this._feedRepository = feedRepository;

    Object.freeze(this);
  }

  async addFeed({ rssUrl, hashtag, title, chatId }) {
    const [ chaIdFormatted ] = formatToString([ chatId ]);
    const feed = new Feed(rssUrl, hashtag, title, chaIdFormatted);

    await this._feedRepository.addFeed(feed.getValues());

    return;
  }

  async getFeeds({ chatId }) {
    const [ chaIdFormatted ] = formatToString([ chatId ]);

    const feeds = await this._feedRepository.getFeeds({ chatId: chaIdFormatted });

    return feeds;
  }

  async ownThisChat({ chatId }) {
    const [ chaIdFormatted ] = formatToString([ chatId ]);

    const contains = await this._feedRepository.ownThisChat({ chatId: chaIdFormatted });

    return contains;
  }

  async dropFeedByTitle({ title, chatId }) {
    const [ titleFormatted, chatIdFormatted ] = formatToString([ title, chatId ]);

    await this._feedRepository.dropFeedByTitle({ 
      title: titleFormatted,
      chatId: chatIdFormatted });

    return;
  } 

  async  existsFeedByTitle({ title, chatId }) {
    const [ titleFormatted, chaIdFormatted ] = formatToString([ title, chatId ]);

    const exists = await this._feedRepository.existsFeedByTitle({
      title: titleFormatted,
      chatId: chaIdFormatted });

    return exists;
  }
}

module.exports = FeedServices;