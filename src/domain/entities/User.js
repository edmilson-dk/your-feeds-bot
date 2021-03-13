class User {
  constructor(user_id, username) {
    this.user_id = String(user_id);
    this.username = username;

    Object.freeze(this);
  }

  getValues() {
    return {
      user_id: this.user_id,
      username: this.username,
    }
  }
}

module.exports = User;