import React, { useState, useEffect } from 'react';
import Cart from '../components/Cart';
import OrderForm from '../components/OrderForm';
import { useLocation, useHistory } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

const Checkout = () => {
    const location = useLocation();
    const history = useHistory();
    const initialCartItems = JSON.parse(localStorage.getItem('cartItems')) || location.state?.cartItems || [];
    const [cartItems, setCartItems] = useState(initialCartItems);
    const [showModal, setShowModal] = useState(false);

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
    const handleSubmitOrder = async (formData) => {
        const currentDate = new Date().toISOString().split('T')[0];
        const orderData = {
            user_name: formData.userName,
            email: formData.email,
            phone: formData.phone,
            status_id: 1,
            confirmation_date: currentDate,
            products: cartItems.map(item => ({
                product_id: item.id,
                quantity: item.quantity
            }))
        };

        try {
            const response = await fetch('http://localhost:3000/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });
            if (!response.ok) {
                throw new Error('Problem z zatwierdzeniem zamówienia.');
            }

            setShowModal(true);
            setCartItems([]);
        } catch (error) {
            console.error('Błąd przy składaniu zamówienia:', error);
        }
    };
    const handleCloseModal = () => {
        setShowModal(false);
        history.push('/'); // Przekierowanie do strony głównej
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
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Zamówienie wysłane</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Twoje zamówienie zostało wysłane!</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Zamknij
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
export default Checkout;
