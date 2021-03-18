class ChatUseCaseInterface {

  addChat({ id, title, userId }) {
    throw new Error('Not implemented method');
  }

  getAllChatsOfUser({ userId }) {
    throw new Error('Not implemented method');
  }

  getUserChatById({ userId, chatId }) {
    throw new Error('Not implemented method');
  }

  getUserChatByTitle({ userId, chatTitle }) {
    throw new Error('Not implemented method');
  }

  existsChat({ chatId }) {
    throw new Error('Not implemented method');
  }

  getChatById({ chatId }) {
    throw new Error('Not implemented method');
  }

  dropChat({ userId, chatId }) {
    throw new Error('Not implemented method');
  }

  getAllChatsId() {
    throw new Error('Not implemented method');
  }

  getAllChatsIdActive() {
    throw new Error('Not implemented method');
  }

  updateActiveChat({ isActive, chatId }) {
    throw new Error('Not implemented method');
  }

  containsActiveChatConfig({ userId }) {
    throw new Error('Not implemented method');
  }

  getIsActiveConfigChat({ chatId }) {
    throw new Error('Not implemented method');
  }

  setNotActiveConfigChats({ userId }) {
    throw new Error('Not implemented method');
  }

  setActiveConfigChat({ chatId, userId, state }) {
    throw new Error('Not implemented method');
  }
}

module.exports = ChatUseCaseInterface;