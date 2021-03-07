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

  async titleAlredyExists(title, chat_id) {
    const exists = await knex('feed')
      .where({ ctitle, chat_id })

    return exists.length > 0 ? true : false;
  }
}

module.exports = FeedRepository;
