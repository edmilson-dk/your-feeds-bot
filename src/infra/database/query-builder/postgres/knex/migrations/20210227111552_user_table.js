exports.up = function(knex) {
  knex.schema.hasTable('user').then(exists => {
    if (!exists) {
      return knex.schema.createTable('user', table=> {
        table.string('id', 60).notNullAble().unique();
        table.string('username', 100).notNullAble();

        table.timestamp('created_at').defaultTo(knex.fn.now());
      })
    }
  }) 
};

exports.down = function(knex) {
  knex.schema.dropTableIfExists('user');
};
