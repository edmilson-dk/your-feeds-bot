class User {
  constructor(user_id, username, timezone) {
    this.user_id = String(user_id);
    this.username = username;
    this.timezone = timezone;

    Object.freeze(this);
  }
}

module.exports = User;