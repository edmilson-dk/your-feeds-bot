const ChatUseCaseInterface = require("../../domain/use-cases/chat-usecase-interface");
const { formatToString } = require("../../helpers/features_helpers");

class ChatServices extends ChatUseCaseInterface {
  constructor({ chatRepository }) {
    this._chatRepository = chatRepository;
    
    Object.freeze(this);
  }

  async addChat({ id, title, userId }) {
    const [idFormatted, titleFormatted, userIdFormatted] = formatToString([id, title, userId]);

    await this._chatRepository.addChat({ 
      id: idFormatted, 
      title: titleFormatted, 
      userId: userIdFormatted });

    return;
  }

  async getAllChatsOfUser({ userId }) {
    const [ userIdFormatted ] = formatToString([ userId ]);

    const chats = await this._chatRepository.getAllChatsOfUser({ userId: userIdFormatted });

    return chats;
  }

  async getUserChatById({ userId, chatId }) {
   const [ userIdFormatted, chatIdFormatted ] = formatToString([ userId, chatId ]);

   const chat = await this._chatRepository.getOneChatById({ 
     userId: userIdFormatted,
     chatId: chatIdFormatted });

   return chat;
  }

  async getUserChatByTitle({ userId, chatTitle }) {
    const [ userIdFormatted, chatTitleFormatted ] = formatToString([ userId, chatTitle ]);

    const chat = await this._chatRepository.getOneChatByTitle({
      userId: userIdFormatted,
      chatTitle: chatTitleFormatted });

    return chat;
  }

  async existsChat({ chatId }) {
    const [ chatIdFormatted ] = formatToString([ chatId ]);

    const exists = await this._chatRepository.existsChat({ chatId: chatIdFormatted });

    return exists;
  }

  async getChatById({ chatId }) {
    const [ chatIdFormatted ] = formatToString([ chatId ]);

    const chat = await this._chatRepository.getChatById({ chatId: chatIdFormatted });
    
    return chat;
  }

  async dropChat({ userId, chatId }) {
    const [ userIdFormatted, chatIdFormatted ] = formatToString([ userId, chatId ]);

    await this._chatRepository.dropChat({ 
      userId: userIdFormatted,
      chatId: chatIdFormatted });

    return;
  }

  async getAllChatsId() {
    const chats = await this._chatRepository.getAllChatsId();
    return chats;
  }

  async getAllChatsIdActive() {
    const chats = await this.getAllChatsIdActive();
    return chats;
  }

  async updateActiveChat({ isActive, chatId }) {
    const [ chatIdFormatted ] = formatToString([ chatId ]);

    await this._chatRepository.updateActiveChat({
      isActive,
      chatId: chatIdFormatted });
    
    return;
  }

  async getIsActiveConfigChat({ chatId }) {
    const [ chatIdFormatted ] = formatToString([ chatId ]);

    const chats = await this._chatRepository.getIsActiveConfigChat({ chatId: chatIdFormatted });

    return chats;
  }

  async setNotActiveConfigChats({ userId }) {
    const [ userIdFormatted ] = formatToString([ userId ]);

    await this._chatRepository.setNotActiveConfigChats({ userId: userIdFormatted });

    return;
  }

  async setActiveConfigChat({ chatId, userId, state }) {
    const [ chatIdFormatted, userIdFormatted ] = formatToString([ chatId, userId ]);

    await this._chatRepository.setActiveConfigChat({
      chatId: chatIdFormatted,
      userId: userIdFormatted,
      state });

    return;
  }
}

module.exports = ChatServices;