exports.up = function(knex) {
  knex.schema.hasTable('feeds').then(exists => {
    if (!exists) {
      return knex.schema.createTable('feeds', table => {
        table.string('rss_url').notNullable();
        table.string('hashtag').notNullable();
        table.string('title', 60).notNullable();

        // relation to chat table
        table.string('chat_id', 60)
          .references('chats.id')
          .notNullable()
          .onDelete('CASCADE');
        
        table.timestamp('created_at').defaultTo(knex.fn.now());
      });
    }
  });
};

exports.down = function(knex) {
  knex.schema.dropTableIfExists('feeds');
};
