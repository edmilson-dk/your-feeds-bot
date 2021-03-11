const knex = require('../database/query-builder/postgres/knex');

class FeedRepository {
  async addFeed({ rss_url, hashtag, title, chat_id }) {
    await knex('feeds')
      .insert({
        rss_url,
        hashtag,
        title,
        chat_id,
      })

    return;
  }

  async getFeeds(chat_id) {
    const rows = await knex('feeds')
      .where({ chat_id })
      .join('chats', 'chats.id', '=', 'feeds.chat_id')
      .select('feeds.*')

    return rows;
  }

  async containChat(chat_id) {
    const contain = await knex('feeds')
      .where({ chat_id })

    return contain.length > 0 ? true : false;
  }

  async dropFeed(feed_title, chat_id) {
    await knex('feeds')
      .where({ title: feed_title, chat_id })
      .del();

    return;
  }

  async existsFeedByTitle(title, chat_id) {
    const exists = await knex('feeds')
      .where({ title, chat_id })

    return exists.length > 0 ? true : false;
  }
}

module.exports = FeedRepository;
