exports.up = function(knex) {
    return knex.schema.createTable('products', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.text('description');
        table.decimal('unit_price', 10, 2).notNullable();
        table.decimal('unit_weight', 10, 2).notNullable();
        table.integer('category_id').unsigned().notNullable();
        table.foreign('category_id').references('categories.id');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('products');
};
