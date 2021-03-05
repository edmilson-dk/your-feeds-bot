exports.up = function(knex) {
  knex.schema.hasTable('chat').then(exists => {
    if (!exists) {
      return knex.schema.createTable('chat', table => {
        table.string('id', 60).notNullable().unique();
        table.string('title', 100).notNullable();
        table.string('interval_post', 60).notNullable();

        // relation to user table
        table.string('user_id')
          .references('user.id')
          .notNullable()
          .onDelete('CASCADE');

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
      })
    }  
  })
};

exports.down = function(knex) {
  knex.schema.dropTableIfExists('chat');
};
