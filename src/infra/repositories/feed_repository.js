const knex = require('../database/query-builder/postgres/knex');

class FeedRepository {
  async addFeed({ rss_url, hashtag, title, chat_id }) {
    await knex('feed')
    .insert({
      rss_url,
      hashtag,
      title,
      chat_id,
    })

    return;
  }

  async getFeeds(chat_id) {
    const rows = knex('feed')
      .where({ chat_id })
      .join('chat', 'chat.id', '=', 'feed.chat_id')
      .select('feed.*', 'chat.ttile')
  }
}

module.exports = FeedRepository;
