const express = require('express');
const router = express.Router();
const knex = require('../../../db');
const { body, validationResult } = require('express-validator');
const {isInt, isDate} = require("validator");

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
router.post('/', [
    body('user_name').notEmpty().withMessage('User name cannot be empty'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('phone').isMobilePhone().withMessage('Invalid phone number format'),
    body('status_id').custom(value => isInt(value, { min: 1, max: 4 })).withMessage('Status ID must be between 1 and 4'),
    body('confirmation_date').optional().custom(value => !value || isDate(value)).withMessage('Invalid date format'),
    body('products').isArray().withMessage('Products must be an array'),
    body('products.*.product_id').isInt({ gt: 0 }).withMessage('Product ID must be a positive integer'),
    body('products.*.quantity').isInt({ gt: 0 }).withMessage('Quantity must be a positive integer')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Rozpoczęcie transakcji
        await knex.transaction(async trx => {
            const newOrderData = {
                user_name: req.body.user_name,
                email: req.body.email,
                phone: req.body.phone,
                status_id: req.body.status_id,
                confirmation_date: req.body.confirmation_date || null
            };

            const [newOrderId] = await trx('orders').insert(newOrderData, 'id');

            // Pobierz ID produktów z żądania
            const productIds = req.body.products.map(p => p.product_id);

            // Sprawdź, czy wszystkie produkty istnieją w bazie danych
            const existingProducts = await trx('products').whereIn('id', productIds).select('id');
            if (existingProducts.length !== productIds.length) {
                return res.status(400).send('One or more products do not exist');
            }

            const orderItems = req.body.products.map(product => {
                return {
                    order_id: newOrderId,
                    product_id: product.product_id,
                    quantity: product.quantity
                };
            });

            await trx('order_items').insert(orderItems);
        });

        res.status(201).send('Order created successfully');
    } catch (error) {
        res.status(500).send(error);
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

        // Przykładowe ID statusów dla demonstracji
        const STATUS_ANULOWANE = 3; // Przykładowe ID dla "Anulowane"
        const STATUS_ZREALIZOWANE = 4; // Przykładowe ID dla "Zrealizowane"

        // Zmiana statusu po anulowaniu zamówienia
        if (order.status_id === STATUS_ANULOWANE) {
            return res.status(400).send('Cannot change status of a cancelled order');
        }

        // Zmiana statusu "wstecz" np. ze "Zrealizowane" na "Niezatwierdzone"
        if (order.status_id === STATUS_ZREALIZOWANE && status_id < STATUS_ZREALIZOWANE) {
            return res.status(400).send('Cannot revert status from "Zrealizowane"');
        }

        // Aktualizacja statusu zamówienia
        await knex('orders').where('id', req.params.id).update({ status_id });
        res.send('Order status updated');
    } catch (error) {
        res.status(400).send(error);
    }
});

// Pobierz zamówienia z określonym stanem
router.get('/status/:statusId', async (req, res) => {
    try {
        const statusId = req.params.status_id;
        const orders = await knex('orders').where('status_id', statusId);
        if (orders.length > 0) {
            res.json(orders);
        } else {
            res.status(404).send('No orders found for the given status');
        }
    } catch (error) {
        res.status(500).send(error);
    }
});


module.exports = router;
