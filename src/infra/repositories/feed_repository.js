const knex = require('../database/query-builder/postgres/knex');

class FeedRepository {
  async getFeed(chat_id) {
    const rows = knex('feed')
      .where({ chat_id })
      .join('chat', 'chat.id', '=', 'feed.chat_id')
      .select('feed.*', 'chat.ttile')
  }
}

module.exports = FeedRepository;
