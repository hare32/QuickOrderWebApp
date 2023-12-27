const knex = require('../knexfile');
const bookshelf = require('bookshelf')(knex);

const Product = bookshelf.model('Product', {
    tableName: 'products',
    category() {
        return this.belongsTo('Category');
    }
});

module.exports = Product;
