const express = require('express');
const router = express.Router();
const knex = require('../knexfile');

// Pobierz wszystkie kategorie
router.get('/', async (req, res) => {
    try {
        const categories = await knex.select('*').from('categories');
        res.json(categories);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
