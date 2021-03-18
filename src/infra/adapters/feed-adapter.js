const FeedServices = require("../../application/services/feed-services");
const FeedRepository = require("../repositories/postgres/query-builder/knex/feed-repository");

const postgresqlRepository = new FeedRepository();
const feedServices = new FeedServices({ feedRepository: postgresqlRepository });

module.exports = feedServices;