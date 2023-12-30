import React, { useState, useEffect } from 'react';
import Cart from '../components/Cart';
import OrderForm from '../components/OrderForm';
import { Modal, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const Checkout = () => {
    const history = useHistory();
    const initialCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const [cartItems, setCartItems] = useState(initialCartItems);
    const [showOrderConfirmationModal, setShowOrderConfirmationModal] = useState(false);

    useEffect(() => {
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
        // Tutaj implementacja wysyłania zamówienia
        console.log('Order submitted:', formData, cartItems);

        // Pokaż modal z potwierdzeniem
        setShowOrderConfirmationModal(true);

        // Resetuj koszyk
        setCartItems([]);
        localStorage.removeItem('cartItems');
    };

    const handleCloseConfirmationModal = () => {
        setShowOrderConfirmationModal(false);
        history.push('/'); // Przekierowanie na stronę główną
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
            <Modal show={showOrderConfirmationModal} onHide={handleCloseConfirmationModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Potwierdzenie zamówienia</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Twoje zamówienie zostało zatwierdzone!
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseConfirmationModal}>
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Checkout;
