const FeedStyleServices = require("../../application/services/feed-style-services");
const FeedStyleRepository = require("../repositories/postgres/query-builder/knex/feed-style-repository");

const postgresqlRepository = new FeedStyleRepository();
const feedStyleServices = new FeedStyleServices({ feedStyleRepository: postgresqlRepository });

module.exports = feedStyleServices;