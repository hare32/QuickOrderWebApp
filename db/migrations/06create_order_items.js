exports.up = function(knex) {
    return knex.schema.createTable('order_items', table => {
        table.integer('order_id').unsigned().notNullable();
        table.integer('product_id').unsigned().notNullable();
        table.integer('quantity').notNullable();
        table.primary(['order_id', 'product_id']);
        table.foreign('order_id').references('orders.id');
        table.foreign('product_id').references('products.id');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('order_items');
};
