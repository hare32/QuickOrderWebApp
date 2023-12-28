const express = require('express');
const router = express.Router();
const knex = require('../knexfile');

// Pobierz wszystkie stany zamówienia
router.get('/', async (req, res) => {
    try {
        const statuses = await knex.select('*').from('order_statuses');
        res.json(statuses);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
