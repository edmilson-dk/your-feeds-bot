exports.up = function(knex) {
  knex.schema.hasTable('feed').then(exists => {
    if (!exists) {
      return knex.schema.createTable('feed', table => {
        table.string('rss_url').notNullAble();
        
        // relation to chat table
        table.string('chat_id', 60)
          .references('chat.id')
          .notNullAble()
          .onDelete('CASCADE');
        
        table.timestamp('created_at').defaultTo(knex.fn.now());
      });
    }
  });
};

exports.down = function(knex) {
  knex.schema.dropTableIfExists('feed');
};
