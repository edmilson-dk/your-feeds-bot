class Chat {
  constructor( id, title, user_id ) {
    this.id = String(id);
    this.title = title;
    this.user_id = String(user_id);

    Object.freeze(this);
  }

  getValues() {
    return {
      id: this.id,
      title: this.title,
      user_id: this.user_id
    }
  }
}

module.exports = Chat;