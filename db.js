// db.js
const knex = require('knex');
const knexConfig = require('./knexfile');

const db = knex(knexConfig.development); // użyj odpowiedniej konfiguracji środowiska
module.exports = db;
