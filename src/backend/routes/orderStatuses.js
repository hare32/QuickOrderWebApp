const express = require('express');
const router = express.Router();
const knex = require('../../../db');

const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;

// Pobierz wszystkie stany zamówienia
router.get('/', async (req, res) => {
    try {
        const statuses = await knex.select('*').from('order_statuses');
        res.json(statuses);
    } catch (error) {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send(error);
    }
});

module.exports = router;
