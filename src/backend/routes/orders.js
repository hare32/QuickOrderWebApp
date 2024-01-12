const express = require('express');
const router = express.Router();
const knex = require('../../../db');
const { body, validationResult } = require('express-validator');
const {isInt, isDate} = require("validator");

const HTTP_STATUS_CREATED = 201;
const HTTP_STATUS_BAD_REQUEST = 400;
const HTTP_STATUS_NOT_FOUND = 404;
const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;

// Pobierz wszystkie zamówienia
router.get('/', async (req, res) => {
    try {
        const orders = await knex('orders')
            .leftJoin('order_items', 'orders.id', 'order_items.order_id')
            .leftJoin('products', 'order_items.product_id', 'products.id')
            .select('orders.*', 'order_items.quantity', 'products.name as product_name', 'products.id as product_id')
            .orderBy('orders.id');

        // Grupowanie produktów dla każdego zamówienia
        const groupedOrders = orders.reduce((acc, order) => {
            if (!acc[order.id]) {
                acc[order.id] = {
                    id: order.id,
                    user_name: order.user_name,
                    email: order.email,
                    phone: order.phone,
                    status_id: order.status_id,
                    confirmation_date: order.confirmation_date,
                    products: []
                };
            }

            if (order.product_id) {
                acc[order.id].products.push({
                    product_id: order.product_id,
                    product_name: order.product_name,
                    quantity: order.quantity
                });
            }

            return acc;
        }, {});

        res.json(Object.values(groupedOrders));
    } catch (error) {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send(error);
    }
});


// Pobierz zamówienie po ID
router.get('/:id', async (req, res) => {
    try {
        const orderDetails = await knex('orders')
            .leftJoin('order_items', 'orders.id', 'order_items.order_id')
            .leftJoin('products', 'order_items.product_id', 'products.id')
            .select('orders.*', 'order_items.quantity', 'products.name as product_name', 'products.id as product_id')
            .where('orders.id', req.params.id);

        if (orderDetails.length === 0) {
            return res.status(HTTP_STATUS_NOT_FOUND).send('Order not found');
        }

        const order = {
            ...orderDetails[0],
            products: orderDetails.map(item => ({
                product_id: item.product_id,
                product_name: item.product_name,
                quantity: item.quantity
            }))
        };

        res.json(order);
    } catch (error) {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send(error);
    }
});


// Pobierz zamówienia dla konkretnej nazwy użytkownika
router.get('/user/:username', async (req, res) => {
    try {
        const userOrders = await knex('orders')
            .leftJoin('order_items', 'orders.id', 'order_items.order_id')
            .leftJoin('products', 'order_items.product_id', 'products.id')
            .select('orders.*', 'order_items.quantity', 'products.name as product_name', 'products.id as product_id')
            .where('orders.user_name', req.params.username)
            .orderBy('orders.id');

        const groupedOrders = userOrders.reduce((acc, order) => {
            if (!acc[order.id]) {
                acc[order.id] = {
                    id: order.id,
                    user_name: order.user_name,
                    email: order.email,
                    phone: order.phone,
                    status_id: order.status_id,
                    confirmation_date: order.confirmation_date,
                    products: []
                };
            }

            if (order.product_id) {
                acc[order.id].products.push({
                    product_id: order.product_id,
                    product_name: order.product_name,
                    quantity: order.quantity
                });
            }

            return acc;
        }, {});

        res.json(Object.values(groupedOrders));
    } catch (error) {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send(error);
    }
});


// Dodaj nowe zamówienie
router.post('/', [
    body('user_name').notEmpty().withMessage('User name cannot be empty'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('phone').isMobilePhone().withMessage('Invalid phone number format'),
    body('status_id').isInt({ min: 1, max: 4 }).withMessage('Status ID must be between 1 and 4'),
    body('confirmation_date').optional().custom(value => !value || isDate(value)).withMessage('Invalid date format'),
    body('products').isArray().withMessage('Products must be an array'),
    body('products.*.product_id').isInt({ gt: 0 }).withMessage('Product ID must be a positive integer'),
    body('products.*.quantity').isInt({ gt: 0 }).withMessage('Quantity must be a positive integer')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HTTP_STATUS_BAD_REQUEST).json({ errors: errors.array() });
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
                return res.status(HTTP_STATUS_BAD_REQUEST).send('One or more products do not exist');
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

        res.status(HTTP_STATUS_CREATED).send('Order created successfully');
    } catch (error) {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send(error);
    }
});

// Zmień stan zamówienia
router.patch('/:id', async (req, res) => {
    try {
        const { status_id } = req.body;
        const order = await knex('orders').where('id', req.params.id).first();

        if (!order) {
            return res.status(HTTP_STATUS_NOT_FOUND).send('Order not found');
        }

        const STATUS_ANULOWANE = 3;
        const STATUS_ZREALIZOWANE = 4;

        // Zmiana statusu po anulowaniu zamówienia
        if (order.status_id === STATUS_ANULOWANE) {
            return res.status(HTTP_STATUS_BAD_REQUEST).send('Cannot change status of a cancelled order');
        }

        // Zmiana statusu "wstecz" np. ze "Zrealizowane" na "Niezatwierdzone"
        if (order.status_id === STATUS_ZREALIZOWANE && status_id < STATUS_ZREALIZOWANE) {
            return res.status(HTTP_STATUS_BAD_REQUEST).send('Cannot revert status from "Zrealizowane"');
        }

        // Aktualizacja statusu zamówienia
        await knex('orders').where('id', req.params.id).update({ status_id });
        res.send('Order status updated');
    } catch (error) {
        res.status(HTTP_STATUS_BAD_REQUEST).send(error);
    }
});

// Pobierz zamówienia z określonym stanem
router.get('/status/:statusId', async (req, res) => {
    try {
        const statusOrders = await knex('orders')
            .leftJoin('order_items', 'orders.id', 'order_items.order_id')
            .leftJoin('products', 'order_items.product_id', 'products.id')
            .select('orders.*', 'order_items.quantity', 'products.name as product_name', 'products.id as product_id')
            .where('orders.status_id', req.params.statusId)
            .orderBy('orders.id');

        // Sprawdzenie, czy zostały znalezione jakiekolwiek zamówienia
        if (statusOrders.length === 0) {
            return res.status(HTTP_STATUS_NOT_FOUND).send('No orders found for the given status');
        }

        const groupedOrders = statusOrders.reduce((acc, order) => {
            if (!acc[order.id]) {
                acc[order.id] = {
                    id: order.id,
                    user_name: order.user_name,
                    email: order.email,
                    phone: order.phone,
                    status_id: order.status_id,
                    confirmation_date: order.confirmation_date,
                    products: []
                };
            }

            if (order.product_id) {
                acc[order.id].products.push({
                    product_id: order.product_id,
                    product_name: order.product_name,
                    quantity: order.quantity
                });
            }

            return acc;
        }, {});

        res.json(Object.values(groupedOrders));
    } catch (error) {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send(error);
    }
});



module.exports = router;
