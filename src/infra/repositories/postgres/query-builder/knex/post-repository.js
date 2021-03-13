const PostRepositoryInterface = require("../../../../../application/contracts/post-repository-interface");
const knex = require("../../../../../drivers/database/query-builder/postgres/knex");

class PostRepository extends PostRepositoryInterface {
  async addPost({ title, chatId }) {
    await knex('posts')
      .insert({ title, chat_id: chatId });

    return;
  }

  async existsPost({ title, chatId }) {
    const exists = await knex('posts')
      .where({ title, chat_id: chatId });

    return exists.length > 0 ? true : false;
  }

  async getPostsCount({ chatId }) {
    const count = await knex('posts')
      .where({ chat_id: chatId })
      .count();

    return count[0];
  }

  async dropAllPosts() {
    await knex('posts')
      .del();

    return;
  }
}

module.exports = PostRepository;