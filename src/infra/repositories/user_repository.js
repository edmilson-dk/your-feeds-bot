const knex = require('../database/query-builder/postgres/knex');

class UserRepository {
  async add({ user_id, username }) {
    if ((await this.existsUser(user_id))) return;
    
    await knex('users')
      .insert({
        id: user_id,
        username,
      });

    return;
  }

  async dropUser(user_id) {
    await knex('users')
      .where({ id: user_id })
      .del();

    return;
  }

  async existsUser(user_id) {
    const exists = await knex('users')
      .where({ id: user_id });

    return exists.length > 0 ? true : false;
  }

  async getUser(user_id) {
    const row = await knex('users')
      .where({ id: user_id });

    return row;
  }

  async getAllUsersId() {
    const rows = await knex('users')
      .select('id');

    return rows;
  }
}

module.exports = UserRepository;
