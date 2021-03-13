const ChatRepositoryInterface = require("../../../../../application/contracts/chat-repository-interface");
const knex = require("../../../../../drivers/database/query-builder/postgres/knex");

class ChatRepository extends ChatRepositoryInterface {
  async addChat({ id, title, userId }) {
    await knex('chats')
      .insert({ id, title, user_id: userId });

    return;
  }

  async getAllChatsOfUser({ userId }) {
    const rows = await knex('chats')
      .where({ user_id: userId })
      .join('users', 'users.id', '=', 'chats.user_id')
      .select('chats.*', 'users.username');

    return rows;
  }

  async getUserChatById({ userId, chatId }) {
    const row = await knex('chats')
      .where({ id: chatId, user_id: userId })

    return row;
  }

  async getUserChatByTitle({ userId, chatTitle }) {
    const row = await knex('chats')
      .where({ title: chatTitle, user_id: userId })

    return row[0];
  }

  async existsChat({ chatId }) {
    const exists = await knex('chats')
      .where({ id: chatId });

    return exists.length > 0 ? true : false;
  }

  async getChatById({ chatId }) {
    const row = await knex('chats')
      .where({ id: chatId });

    return row;
  }

  async dropChat({ userId, chatId }) {
    await knex('chats')
      .where({ id: chatId, userId })
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
      .where({ is_active: true });

    return rows;
  }

  async updateActiveChat({ isActive, chatId }) {
    await knex('chats')
      .where({ id: chatId })
      .update({ is_active: isActive });

    return;
  }

  async getIsActiveConfigChat({ chatId }) {
    const row = await knex('chats')
      .where({ is_active_configuration: true, user_id })
      .select('id');

    return row[0].id;
  }

  async setNotActiveConfigChats({ userId }) {
    await knex('chats')
      .where({ user_id: userId, is_active_configuration: true })
      .update({ is_active_configuration: false });

    return;
  }

  async setActiveConfigChat({ chatId, userId, state }) {
    await knex('chats')
      .where({ id: chatId, user_id: userId })
      .update({ is_active_configuration: state });

    return;
  }
}

module.exports = ChatRepository;