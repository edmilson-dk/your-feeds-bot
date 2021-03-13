class PostRepositoryInterface {
  addPost({ title, chatId }) {
    throw new Error('Not implemented method');
  }

  existsPost({ title, chatId }) {
    throw new Error('Not implemented method');
  }

  getPostsCount({ chatId }) {
    throw new Error('Not implemented method');
  }

  dropAllPosts() {
    throw new Error('Not implemented method');
  }
}

module.exports = PostRepositoryInterface;