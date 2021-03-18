class Feed {
  constructor(rssUrl, hashtag, title, chatId) {
    this.rssUrl = rssUrl;
    this.hashtag = hashtag;
    this.title = title;
    this.chatId = chatId;

    Object.freeze(this);
  }

  getValues() {
    return {
      rssUrl: this.rssUrl,
      hashtag: this.hashtag,
      title: this.title,
      chatId: this.chatId,
    }
  }
}

module.exports = Feed;