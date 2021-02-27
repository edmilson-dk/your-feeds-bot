class User {
  constructor(user_id, username) {
    this.user_id = user_id;
    this.username = username;

    Object.freeze(this);
  }
}

module.exports = User;
