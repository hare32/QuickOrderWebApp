import React from 'react';
import { Button } from 'react-bootstrap';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
    const unitPrice = parseFloat(item.unit_price);

    const quantityStyle = {
        margin: '0 10px',
    };

    return (
        <tr>
            <td>{item.name}</td>
            <td>{unitPrice.toFixed(2)}</td>
            <td>
                <Button onClick={() => onUpdateQuantity(item, -1)}>-</Button>
                <span style={quantityStyle}>{item.quantity}</span>
                <Button onClick={() => onUpdateQuantity(item, 1)}>+</Button>
            </td>
            <td>{(unitPrice * item.quantity).toFixed(2)}</td>
            <td>
                <Button variant="danger" onClick={() => onRemove(item)}>Usuń</Button>
            </td>
        </tr>
    );
};

export default CartItem;
