import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const OrderForm = ({ onSubmitOrder }) => {
    const [formData, setFormData] = useState({ userName: '', email: '', phone: '' });
    const [formErrors, setFormErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when the field is changed
        setFormErrors({ ...formErrors, [e.target.name]: null });
    };

    const validateForm = () => {
        let errors = {};
        if (!formData.userName.trim()) errors.userName = 'Nazwa użytkownika jest wymagana.';
        if (!formData.email) {
            errors.email = 'Email jest wymagany.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email jest nieprawidłowy.';
        }
        if (!formData.phone) {
            errors.phone = 'Telefon jest wymagany.';
        } else if (!/^\d{9}$/.test(formData.phone)) {
            errors.phone = 'Numer telefonu jest nieprawidłowy.';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmitOrder(formData);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>Nazwa użytkownika</Form.Label>
                <Form.Control type="text" name="userName" value={formData.userName} onChange={handleChange} isInvalid={!!formErrors.userName} />
                <Form.Control.Feedback type="invalid">{formErrors.userName}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} isInvalid={!!formErrors.email} />
                <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Label>Telefon</Form.Label>
                <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} isInvalid={!!formErrors.phone} />
                <Form.Control.Feedback type="invalid">{formErrors.phone}</Form.Control.Feedback>
            </Form.Group>
            <Button type="submit">Zatwierdź zamówienie</Button>
        </Form>
    );
};

export default OrderForm;
