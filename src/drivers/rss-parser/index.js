const Parser = require('rss-parser');
const parser = new Parser();

class RssParser {
  async getFeedTitle(rssURL) {
    const feed = await parser.parseURL(rssURL);
    return feed.title;
  }

  async getFeeds(rssURL) {
    try {
      const feeds = await parser.parseURL(rssURL);
      
      return feeds.items;
    } catch (err) {
      return [];
    }
  }

  async rssIsValid(rssURL) {
    try { 
      await parser.parseURL(rssURL);
      return true;
    } catch (err) {
      console.log(err)
      return false;
    }
  }
}

module.exports = RssParser;