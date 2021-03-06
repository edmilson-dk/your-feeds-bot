const knex = require('../database/query-builder/postgres/knex');

class ChatRepository {
  async addChat({
    id, 
    title, 
    user_id, 
    interval_post, 
    start_posts, 
    end_posts, 
    next_posts_time
    }) {
    await knex('chat')
      .insert({
        id,
        title,
        user_id,
        interval_post,
        start_posts,
        end_posts,
        next_posts_time
      });

    return;
  }

  async getAllChatOfUser(user_id) {
    const rows = await knex('chat')
      .where({ user_id })
      .join('user', 'user.id', '=', 'chat.user_id')
      .select('chat.*', 'user.username');

    return rows;
  }

  async getOneChatById(user_id, chat_id) {
    const row = await knex('chat')
      .where({ id: chat_id, user_id })

    return row;
  }

  async getOneChatByTitle(user_id, chat_title) {
    const row = await knex('chat')
      .where({ title: chat_title, user_id })

    return row;
  }

  async existsChat(chat_id) {
    const exists = await knex('chat')
    .where({ id: chat_id });

    return exists.length > 0 ? true : false;
  }

  async getDbChat(chat_id) {
    const row = await knex('chat')
    .where({ id: chat_id });

    return row;
  }

  async dropChat(user_id, chat_id) {
    await knex('chat')
      .where({ id: chat_id, user_id })
      .del();

    return;
  }
}

module.exports = ChatRepository;
