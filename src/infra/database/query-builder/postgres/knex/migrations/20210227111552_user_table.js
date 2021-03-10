exports.up = function (knex) {
  knex.schema.hasTable('users').then(exists => {
    if (!exists) {
      return knex.schema.createTable('users', table=> {
        table.string('id', 60).notNullable().unique();
        table.string('username', 100).notNullable();
        table.string('timezone', 10).notNullable();

        table.timestamp('created_at').defaultTo(knex.fn.now());
      })
    }
  }) 
};

exports.down = function (knex) {
  knex.schema.dropTableIfExists('users');
};
