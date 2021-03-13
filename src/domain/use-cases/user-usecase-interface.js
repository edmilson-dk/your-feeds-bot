class UserUseCaseInterface {
  addUser({ userId, username }) {
    throw new Error('Not implemented method');
  }

  dropUserById({ userId }) {
    throw new Error('Not implemented method');
  }

  existsUser({ userId }) {
    throw new Error('Not implemented method');
  }

  getUserById({ userId }) {
    throw new Error('Not implemented method');
  }

  getAllUsersId() {
    throw new Error('Not implemented method');
  }
}

module.exports = UserUseCaseInterface;