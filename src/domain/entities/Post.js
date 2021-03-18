class Post {
  constructor(title, chatId) {
    this.title = title;
    this.chatId = chatId;

    Object.freeze(this);
  }

  getValues() {
    return {
      title: this.title,
      chatId: this.chatId,
    }
  }
}

module.exports = Post;