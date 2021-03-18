<<<<<<< HEAD
const environment = process.env.NODE_ENV || 'development';

const knexConfig = require('../../../../../../knexfile')[environment];
const knex = require('knex')(knexConfig);
=======
const knexfile = require('../../../../../../knexfile');
const knex = require('knex')(knexfile.production);
>>>>>>> 41ebc27b67b284c272f2c03fc54569e1197c4b6f

module.exports = knex;
