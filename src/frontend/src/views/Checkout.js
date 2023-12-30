import React from 'react';
import Cart from '../components/Cart';
import OrderForm from '../components/OrderForm';
import { useLocation } from 'react-router-dom';

const Checkout = () => {
    const location = useLocation();
    const initialCartItems = location.state?.cartItems || JSON.parse(localStorage.getItem('cart')) || [];
    const [cartItems, setCartItems] = React.useState(initialCartItems);
    const handleUpdateQuantity = (item, change) => {
        if (item.quantity + change >= 1) {
            setCartItems(cartItems.map(cartItem =>
                cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + change } : cartItem
            ));
        }
    };

    const handleRemoveItem = (itemToRemove) => {
        setCartItems(cartItems.filter(item => item.id !== itemToRemove.id));
    };

    const handleSubmitOrder = (formData) => {
        // Implementacja wysyłania zamówienia
    };

    return (
        <div>
            <h1>Koszyk</h1>
            <Cart cartItems={cartItems} onUpdateQuantity={handleUpdateQuantity} onRemove={handleRemoveItem}/>
            <h2>Formularz zamówienia</h2>
            <OrderForm onSubmitOrder={handleSubmitOrder}/>
        </div>
    );
};

export default Checkout;
