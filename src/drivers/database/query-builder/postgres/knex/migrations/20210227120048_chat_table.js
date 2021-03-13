exports.up = function(knex) {
  knex.schema.hasTable('chats').then(exists => {
    if (!exists) {
      return knex.schema.createTable('chats', table => {
        table.string('id', 60).notNullable().unique();
        table.string('title', 100).notNullable();
        table.boolean('is_active').defaultTo(false);
        table.boolean('is_active_configuration').defaultTo(false);

        // relation to user table
        table.string('user_id')
          .references('users.id')
          .notNullable()
          .onDelete('CASCADE');

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
      })
    }  
  })
};

exports.down = function(knex) {
  knex.schema.dropTableIfExists('chats');
};
