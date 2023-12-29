import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const OrderForm = ({ onSubmitOrder }) => {
    const [formData, setFormData] = useState({ userName: '', email: '', phone: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmitOrder(formData);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>Nazwa użytkownika</Form.Label>
                <Form.Control type="text" name="userName" value={formData.userName} onChange={handleChange} required />
            </Form.Group>
            <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
            </Form.Group>
            <Form.Group>
                <Form.Label>Telefon</Form.Label>
                <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
            </Form.Group>
            <Button type="submit">Zatwierdź zamówienie</Button>
        </Form>
    );
};

export default OrderForm;
