const express = require('express');
const cors = require('cors');
const app = express();

const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const orderStatusRoutes = require('./routes/orderStatuses');

app.use(cors({
    origin: 'http://localhost:3001', // Dopuszczalne źródło, gdzie frontend jest hostowany
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Dopuszczalne metody HTTP
    credentials: true, // Wsparcie dla credentiale, jak cookies, etc.
    optionsSuccessStatus: 204 // Jaki status dla preflight request
}));

app.use(express.json());

app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/orders', orderRoutes);
app.use('/orderStatuses', orderStatusRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
