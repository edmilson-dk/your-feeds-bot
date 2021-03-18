const Post = require("../../domain/entities/Post");
const PostUseCaseInterface = require("../../domain/use-cases/post-usecase-interface");
const { formatToString } = require("../../helpers/features_helpers");

class PostServices extends PostUseCaseInterface {
  constructor({ postRepository }) {
    super();
    
    this._postRepository = postRepository;

    Object.freeze(this);
  }

  async addPost({ title, chatId }) {
    const [ chaIdFormatted ] = formatToString([ chatId ]);
    const post = new Post(title, chaIdFormatted);

    await this._postRepository.addPost(post.getValues());
  
    return;
  }

  async existsPost({ title, chatId }) {
    const [ titleFormatted, chaIdFormatted ] = formatToString([ title, chatId ]);

    const exists = await this._postRepository.existsPost({ 
      title: titleFormatted,
      chatId: chaIdFormatted });

    return exists;
  }

  async getPostsCount({ chatId }) {
    const [ chaIdFormatted ] = formatToString([ chatId ]);

    const count = await this._postRepository.getPostsCount({ chatId: chaIdFormatted });

    return count;
  }

  async dropAllPosts() {
    await this._postRepository.dropAllPosts();

    return;
  }
}

module.exports = PostServices;