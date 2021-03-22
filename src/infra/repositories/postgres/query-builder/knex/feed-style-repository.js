const knex = require("../../../../../drivers/database/query-builder/postgres/knex");
const { getFeedStyleTagData } = require('../../../../../helpers/features_helpers');

class FeedStyleRepository {
  async addStyles(data, chatId) {
    await knex('feeds_styles')
      .insert({
        ...getFeedStyleTagData(data),
        chat_id: chatId,
      });
    
    return;
  }

  async getStyles({ chatId }) {
    const row = await knex('feeds_styles')
      .where({ chat_id: chatId })

    return row.length > 0 ? row[0] : [];
  }

  async updateStyles(data, chatId) {
    await knex('feeds_styles')
      .where({ chat_id: chatId })
      .update({ ...getFeedStyleTagData(data) });

    return;
  }

  async existsFeedStyles({ chatId }) {
    const exists = await knex('feeds_styles')
      .where({ chat_id: chatId });

    return exists.length > 0 ? true : false;
  }
}

module.exports = FeedStyleRepository;