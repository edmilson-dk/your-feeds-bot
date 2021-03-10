class Chat {
  constructor(
    id, 
    title, 
    user_id,
    start_posts = "8:00", 
    end_posts = "00:00", 
    ) {
    this.id = String(id);
    this.title = title;
    this.user_id = String(user_id);
    this.start_posts = start_posts;
    this.end_posts = end_posts;

    Object.freeze(this);
  }

  getValues() {
    return {
      id: this.id,
      title: this.title,
      user_id: this.user_id,
      start_posts: this.start_posts,
      end_posts: this.end_posts,
    }
  }
}

module.exports = Chat;