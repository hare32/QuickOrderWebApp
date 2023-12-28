exports.up = function(knex) {
    return knex.schema.createTable('order_statuses', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('order_statuses');
};
