const express = require('express');
const router = express.Router();
const Product = require('@/backend/models/Product');

// Pobierz wszystkie produkty
router.get('/', async (req, res) => {
    try {
        const products = await Product.fetchAll();
        res.json(products);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Dodaj nowy produkt
router.post('/', async (req, res) => {
    try {
        const newProduct = await new Product(req.body).save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
