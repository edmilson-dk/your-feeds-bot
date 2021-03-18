class Chat {
  constructor(id, title, userId) {
    this.id = id;
    this.title = title;
    this.userId = userId;

    Object.freeze(this);
  }

  getValues() {
    return {
      id: this.id,
      title: this.title,
      userId: this.userId
    }
  }
}

module.exports = Chat;