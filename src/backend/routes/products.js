const express = require('express');
const router = express.Router();
const knex = require('../knexfile');

// Pobierz wszystkie produkty
router.get('/', async (req, res) => {
    try {
        const products = await knex.select('*').from('products');
        res.json(products);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Pobierz produkt po ID
router.get('/:id', async (req, res) => {
    try {
        const product = await knex('products').where('id', req.params.id).first();
        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Product not found');
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

// Dodaj nowy produkt
router.post('/', async (req, res) => {
    try {
        const newProduct = await knex('products').insert(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Aktualizuj produkt
router.put('/:id', async (req, res) => {
    try {
        await knex('products').where('id', req.params.id).update(req.body);
        res.send('Product updated');
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
