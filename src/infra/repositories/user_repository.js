const knex = require('../database/query-builder/postgres/knex');

class UserRepository {
  async add(user_id, username) {
    if ((await this.existsUser(user_id))) return;
    
    await knex('user')
      .insert({
        id: user_id,
        username,
      });

    return;
  }

  async existsUser(user_id) {
    const exists = await knex('user')
      .select()
      .where({ id: user_id });

    return exists.length > 0 ? true : false;
  }

  async getUser(user_id) {
    const row = await knex('user')
      .select()
      .where({ id: user_id });

    return row;
  }
}

module.exports = UserRepository;
