exports.up = function(knex) {
  knex.schema.hasTable('feeds_styles').then(exists => {
    if (!exists) {
      return knex.schema.createTable('feeds_styles', table => {
        table.string('title_tag', 60).defaultTo('');
        table.string('description_tag', 60).defaultTo('');
        table.string('content_tag', 60).defaultTo('');

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
  knex.schema.dropTableIfExists('feeds_styles');
};