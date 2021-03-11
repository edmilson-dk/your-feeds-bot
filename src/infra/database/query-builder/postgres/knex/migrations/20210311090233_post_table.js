exports.up = function (knex) {
  knex.schema.hasTable('posts').then(exists => {
    if (!exists) {
      return knex.schema.createTable('posts', table => {
        table.string('title').notNullable();

        table.string('chat_id')
          .references('chats.id')
          .notNullable()
          .onDelete('CASCADE');

        table.timestamp('created_at').defaultTo(knex.fn.now());
      })
    }
  }) 
};

exports.down = function (knex) {
  knex.schema.dropTableIfExists('posts');
};
