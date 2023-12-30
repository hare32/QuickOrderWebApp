import React, { useState, useEffect } from 'react';
import Cart from '../components/Cart';
import OrderForm from '../components/OrderForm';
import { useLocation } from 'react-router-dom';

const Checkout = () => {
    const location = useLocation();
    const initialCartItems = JSON.parse(localStorage.getItem('cartItems')) || location.state?.cartItems || [];
    const [cartItems, setCartItems] = useState(initialCartItems);

    useEffect(() => {
        // Aktualizacja localStorage po każdej zmianie w koszyku
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const handleUpdateQuantity = (item, change) => {
        const updatedItems = cartItems.map(cartItem => {
            if (cartItem.id === item.id) {
                return { ...cartItem, quantity: Math.max(1, cartItem.quantity + change) };
            }
            return cartItem;
        });
        setCartItems(updatedItems);
    };

    const handleRemoveItem = (item) => {
        const updatedItems = cartItems.filter(cartItem => cartItem.id !== item.id);
        setCartItems(updatedItems);
    };

    const handleSubmitOrder = (formData) => {
        // Implementacja wysyłania zamówienia
    };

    const totalCost = cartItems.reduce((total, item) => total + item.quantity * parseFloat(item.unit_price), 0);

    return (
        <div>
            <h1>Koszyk</h1>
            <Cart cartItems={cartItems} onUpdateQuantity={handleUpdateQuantity} onRemove={handleRemoveItem} />
            <div>
                <strong>Łączna cena: {totalCost.toFixed(2)} zł</strong>
            </div>
            <h2>Formularz zamówienia</h2>
            <OrderForm onSubmitOrder={handleSubmitOrder} />
        </div>
    );
};

export default Checkout;
