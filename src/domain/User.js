class User {
  constructor(user_id, username, timezone) {
    this.user_id = String(user_id);
    this.username = username;
    this.timezone = timezone;

    Object.freeze(this);
  }

  getValue() {
    return {
      user_id: this.user_id,
      username: this.username,
      timezone: this.timezone,
    }
  }
}

module.exports = User;