const express = require('express');
const router = express.Router();
const knex = require('../../../db');
const { body, validationResult } = require('express-validator');
const {StatusCodes} = require("http-status-codes");


// Pobierz wszystkie produkty
router.get('/', async (req, res) => {
    try {
        const products = await knex.select('*').from('products');
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Internal Server Error');
    }
});

// Pobierz produkt po ID
router.get('/:id', async (req, res) => {
    try {
        const product = await knex('products').where('id', req.params.id).first();
        if (product) {
            res.json(product);
        } else {
            res.status(StatusCodes.NOT_FOUND).send('Product not found');
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
});

// Dodaj nowy produkt
router.post('/', [
    body('name').notEmpty().withMessage('Name cannot be empty'),
    body('description').notEmpty().withMessage('Description cannot be empty'),
    body('unit_price').isFloat({ gt: 0 }).withMessage('Unit price must be greater than 0'),
    body('unit_weight').isFloat({ gt: 0 }).withMessage('Unit weight must be greater than 0'),
    body('category_id').isInt({ gt: 0 }).withMessage('Category ID must be a positive integer')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    try {
        const newProduct = await knex('products').insert(req.body);
        res.status(StatusCodes.CREATED).json(newProduct);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
});

// Aktualizuj produkt
router.put('/:id', [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('unit_price').optional().isFloat({ gt: 0 }).withMessage('Unit price must be greater than 0'),
    body('unit_weight').optional().isFloat({ gt: 0 }).withMessage('Unit weight must be greater than 0'),
    body('category_id').optional().isInt({ gt: 0 }).withMessage('Category ID must be a positive integer')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    try {
        // Sprawdzanie, czy produkt istnieje
        const existingProduct = await knex('products').where('id', req.params.id).first();
        if (!existingProduct) {
            return res.status(StatusCodes.NOT_FOUND).send('Product with the given ID not found');
        }

        // Aktualizacja produktu
        await knex('products').where('id', req.params.id).update(req.body);
        res.send('Product updated');
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
});



module.exports = router;
