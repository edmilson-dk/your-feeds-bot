const knex = require('../database/query-builder/postgres/knex');

class PostRepository {
  async addPost({ title, chat_id }) {
    await knex('posts')
      .insert({ title, chat_id });
  }

  async existsPost({ title, chat_id }) {
    const exists = await knex('posts')
      .where({ title, chat_id });

    return exists.length > 0 ? true : false;
  }

  async getPostsCount({ chat_id }) {
    const count = await knex('posts')
      .where({ chat_id })
      .count()

    return count[0];
  }


  async dropAllPosts() {
    await knex('posts')
      .del();
  }
}

module.exports = PostRepository;
