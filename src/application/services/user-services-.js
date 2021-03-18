const User = require("../../domain/entities/User");
const UserUseCaseInterface = require("../../domain/use-cases/user-usecase-interface");
const { formatToString } = require("../../helpers/features_helpers");

class UserServices extends UserUseCaseInterface {
  constructor({ userRepository }) {
    super();
    
    this._userRepository = userRepository;

    Object.freeze(this);
  }

  async addUser({ userId, username }) {
    const [ userIdFormatted ] = formatToString([ userId ]);
    const user = new User(userIdFormatted, username);

    await this._userRepository.addUser(user.getValues());

    return;
  }

  async dropUserById({ userId }) {
    const [ userIdFormatted ] = formatToString([ userId ]);

    await this._userRepository.dropUserById({ userId: userIdFormatted });

    return;
  }

  async existsUser({ userId }) {
    const [ userIdFormatted ] = formatToString([ userId ]);

    const exists = await this._userRepository.existsUser({ userId: userIdFormatted });

    return exists;
  }

  async getUserById({ userId }) {
    const [ userIdFormatted ] = formatToString([ userId ]);

    const user = await this._userRepository.getUserById({ userId: userIdFormatted });

    return user;
  }

  async getAllUsersId() {
    const users = await this._userRepository.getAllUsersId();
    return users;
  }
}

module.exports = UserServices;