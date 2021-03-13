const UserRepositoryInterface = require("../../../../../application/contracts/user-repository-interface");
const knex = require("../../../../../drivers/database/query-builder/postgres/knex");

class UserRepository extends UserRepositoryInterface {
  async addUser({ userId, username }) {
    await knex('users')
      .insert({
        id: userId,
        username,
      });

    return;
  }

  async dropUserById({ userId }) {
    await knex('users')
      .where({ id: userId })
      .del();

    return;
  }

  async existsUser({ userId }) {
    const exists = await knex('users')
      .where({ id: userId });

    return exists.length > 0 ? true : false;
  }

  async getUserById({ userId }) {
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