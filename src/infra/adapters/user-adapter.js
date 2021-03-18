const UserServices = require("../../application/services/user-services-");
const UserRepository = require("../repositories/postgres/query-builder/knex/user-repository");

const postgresqlRepository = new UserRepository();
const userServices = new UserServices({ userRepository: postgresqlRepository });

module.exports = userServices;