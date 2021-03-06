class Chat {
  constructor(
    id, 
    title, 
    user_id,
    interval_post = "1", 
    start_posts = "8:00", 
    end_posts = "00:00", 
    next_posts_time = "9:00", 
    ) {
    this.id = String(id);
    this.title = title;
    this.user_id = String(user_id);
    this.interval_post = interval_post;
    this.start_posts = start_posts;
    this.end_posts = end_posts;
    this.next_posts_time = next_posts_time;

    Object.freeze(this);
  }
}

module.exports = Chat;