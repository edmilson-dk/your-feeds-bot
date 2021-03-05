class Chat {
  constructor(
    id, 
    title, 
    interval_post, 
    start_posts, 
    end_posts, 
    next_posts_time, 
    user_id
    ) {
    this.id = id;
    this.title = title;
    this.interval_post = interval_post;
    this.user_id = user_id;

    Object.freeze(this);
  }
}

module.exports = Chat;