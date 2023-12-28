exports.up = function(knex) {
    return knex.schema.createTable('orders', table => {
        table.increments('id').primary();
        table.date('confirmation_date').nullable();
        table.integer('status_id').unsigned().notNullable();
        table.string('user_name').notNullable();
        table.string('email').notNullable();
        table.string('phone').notNullable();
        table.foreign('status_id').references('order_statuses.id');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('orders');
};
