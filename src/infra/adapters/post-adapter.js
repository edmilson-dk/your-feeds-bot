const PostServices = require("../../application/services/post-services");
const PostRepository = require("../repositories/postgres/query-builder/knex/post-repository");

const postgresqlRepository = new PostRepository();
const postServices = new PostServices({ postRepository: postgresqlRepository });

module.exports = postServices;