import React, { useState } from 'react';
import Cart from '../components/Cart';
import OrderForm from '../components/OrderForm';

const Checkout = () => {
    const [cartItems, setCartItems] = useState([]);

    const handleUpdateQuantity = (item, change) => {
        // Implementacja aktualizacji ilości produktu w koszyku
    };

    const handleRemoveItem = (item) => {
        // Implementacja usuwania produktu z koszyka
    };

    const handleSubmitOrder = (formData) => {
        // Implementacja wysyłania zamówienia
    };

    return (
        <div>
            <h1>Koszyk</h1>
            <Cart cartItems={cartItems} onUpdateQuantity={handleUpdateQuantity} onRemove={handleRemoveItem} />
            <h2>Formularz zamówienia</h2>
            <OrderForm onSubmitOrder={handleSubmitOrder} />
        </div>
    );
};

export default Checkout;
