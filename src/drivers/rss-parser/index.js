const Parser = require('rss-parser');
const parser = new Parser();

class RssParser {
  async getFeedTitle(rss_url) {
    const feed = await parser.parseURL(rss_url);
    return feed.title;
  }

  async rssIsValid(rss_url) {
    try { 
      await parser.parseURL(rss_url);
      return true;
    } catch (err) {
      return false;
    }
  }
}

module.exports = RssParser;