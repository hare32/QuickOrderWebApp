const express = require('express');
const router = express.Router();
const knex = require('../knexfile');

// Pobierz wszystkie zamówienia
router.get('/', async (req, res) => {
    try {
        const orders = await knex.select('*').from('orders');
        res.json(orders);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Pobierz zamówienie po ID
router.get('/:id', async (req, res) => {
    try {
        const order = await knex('orders').where('id', req.params.id).first();
        if (order) {
            res.json(order);
        } else {
            res.status(404).send('Order not found');
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

// Pobierz zamówienia dla konkretnej nazwy użytkownika
router.get('/user/:username', async (req, res) => {
    try {
        const orders = await knex('orders').where('user_name', req.params.username);
        res.json(orders);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Dodaj nowe zamówienie
router.post('/', async (req, res) => {
    try {
        const newOrder = await knex('orders').insert(req.body);
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Zmień stan zamówienia
router.patch('/:id', async (req, res) => {
    try {
        const { status_id } = req.body;
        const order = await knex('orders').where('id', req.params.id).first();

        if (!order) {
            return res.status(404).send('Order not found');
        }

        // Dodaj tutaj logikę walidacji zmiany stanu zamówienia.
        // Na przykład, sprawdź czy zmiana na nowy stan jest dozwolona.

        await knex('orders').where('id', req.params.id).update({ status_id });
        res.send('Order status updated');
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
