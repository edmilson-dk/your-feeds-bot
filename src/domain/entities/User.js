class User {
  constructor(userId, username) {
    this.userId = userId;
    this.username = username;

    Object.freeze(this);
  }

  getValues() {
    return {
      userId: this.userId,
      username: this.username,
    }
  }
}

module.exports = User;