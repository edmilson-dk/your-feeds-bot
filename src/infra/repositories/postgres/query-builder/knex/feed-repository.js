const FeedRepositoryInterface = require("../../../../../application/contracts/feed-repository-interface");
const knex = require("../../../../../drivers/database/query-builder/postgres/knex");

class FeedRepository extends FeedRepositoryInterface {
  async addFeed({ rssUrl, hashtag, title, chatId }) {
    await knex('feeds')
      .insert({
        hashtag, 
        title, 
        rss_url: rssUrl, 
        chat_id: chatId,
      });

    return;
  }

  async getFeeds({ chatId }) {
    const rows = await knex('feeds')
      .where({ chat_id: chatId })
      .join('chats', 'chats.id', '=', 'feeds.chat_id')
      .select('feeds.*')

    return rows;
  }

  async ownThisChat({ chatId }) {
    const contain = await knex('feeds')
      .where({ chat_id: chatId })

    return contain.length > 0 ? true : false;
  }

  async dropFeedByTitle({ title, chatId }) {
    await knex('feeds')
      .where({ title, chat_id: chatId })
      .del();

    return;  
  } 

  async existsFeedByTitle({ title, chatId }) {
    const exists = await knex('feeds')
      .where({ title, chat_id: chatId });

    return exists.length > 0 ? true : false;
  }
}

module.exports = FeedRepository;