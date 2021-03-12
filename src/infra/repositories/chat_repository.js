const knex = require('../database/query-builder/postgres/knex');

class ChatRepository {
  async addChat({
    id, 
    title, 
    user_id
    }) {
    await knex('chats')
      .insert({
        id,
        title,
        user_id,
      });

    return;
  }

  async getAllChatOfUser(user_id) {
    const rows = await knex('chats')
      .where({ user_id })
      .join('users', 'users.id', '=', 'chats.user_id')
      .select('chats.*', 'users.username');

    return rows;
  }

  async getOneChatById(user_id, chat_id) {
    const row = await knex('chats')
      .where({ id: chat_id, user_id })

    return row;
  }

  async getOneChatByTitle(user_id, chat_title) {
    const row = await knex('chats')
      .where({ title: chat_title, user_id })

    return row[0];
  }

  async existsChat(chat_id) {
    const exists = await knex('chats')
      .where({ id: chat_id });

    return exists.length > 0 ? true : false;
  }

  async getDbChat(chat_id) {
    const row = await knex('chats')
      .where({ id: chat_id });

    return row;
  }

  async dropChat(user_id, chat_id) {
    await knex('chats')
      .where({ id: chat_id, user_id })
      .del();

    return;
  }

  async getAllChatsId() {
    const rows = await knex('chats')
      .select('id');

    return rows;
  }

  async getAllChatsIdActive() {
    const rows = await knex('chats')
      .select('id')
      .where({ is_active: true })

    return rows;
  }

  async updateActiveChat(is_active, chat_id) {
    await knex('chats')
      .where({ id: chat_id })
      .update({ is_active })
  }

  async getIsActiveConfigChat(user_id) {
    const row = await knex('chats')
      .where({ is_active_configuration: true, user_id })
      .select('id')

    return row[0].id;
  }

  async setNotActiveConfigChats(user_id) {
    await knex('chats')
      .where({ user_id, is_active_configuration: true })
      .update({ is_active_configuration: false })
  }

  async setActiveConfigChat(chat_id, user_id, state) {
    await knex('chats')
      .where({ id: chat_id, user_id })
      .update({ is_active_configuration: state })
  }

  
}

module.exports = ChatRepository;
