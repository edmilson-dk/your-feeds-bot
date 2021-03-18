const Chat = require("../../domain/entities/Chat");
const ChatUseCaseInterface = require("../../domain/use-cases/chat-usecase-interface");
const { formatToString } = require("../../helpers/features_helpers");

class ChatServices extends ChatUseCaseInterface {
  constructor({ chatRepository }) {
    super();

    this._chatRepository = chatRepository;
    
    Object.freeze(this);
  }

  async addChat({ id, title, userId }) {
    const [idFormatted, userIdFormatted] = formatToString([id, userId]);
    const chat = new Chat(idFormatted, title, userIdFormatted);

    await this._chatRepository.addChat(chat.getValues());

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

    const chat = await this._chatRepository.getUserChatByTitle({
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
    const chats = await this._chatRepository.getAllChatsIdActive();
    return chats;
  }

  async updateActiveChat({ isActive, chatId }) {
    const [ chatIdFormatted ] = formatToString([ chatId ]);

    await this._chatRepository.updateActiveChat({
      isActive,
      chatId: chatIdFormatted });
    
    return;
  }

  async containsActiveChatConfig({ userId }) {
    const [ userIdFormatted ] = formatToString([ userId ]);

    const activeChat = await this._chatRepository.containsActiveChatConfig({ userId: userIdFormatted });

    return activeChat;
  }

  async getIsActiveConfigChat({ userId }) {
    const [ userIdFormatted ] = formatToString([ userId ]);

    const chats = await this._chatRepository.getIsActiveConfigChat({ userId: userIdFormatted });

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