const ChatServices = require("../../application/services/chat-services");
const ChatRepository = require("../repositories/postgres/query-builder/knex/chat-repository");

const postgresqlRepository = new ChatRepository();
const chatServices = new ChatServices({ chatRepository: postgresqlRepository });

module.exports = chatServices;