const express = require('express');
const router = express.Router();
const knex = require('../../../db');

const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;

// Pobierz wszystkie kategorie
router.get('/', async (req, res) => {
    try {
        const categories = await knex.select('*').from('categories');
        res.json(categories);
    } catch (error) {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send(error);
    }
});

module.exports = router;
