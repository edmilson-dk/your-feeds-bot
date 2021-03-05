class Feed {
  constructor(rss_url, hashtag, title, chat_id) {
    this.rss_url = rss_url;
    this.hashtag = hashtag;
    this.title = title;
    this.chat_id = chat_id;

    Object.freeze(this);
  }
}

module.exports = Feed;
