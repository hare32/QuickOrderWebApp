import React from 'react';
import { Button } from 'react-bootstrap';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
    return (
        <tr>
            <td>{item.name}</td>
            <td>
                <Button onClick={() => onUpdateQuantity(item, -1)}>-</Button>
                {item.quantity}
                <Button onClick={() => onUpdateQuantity(item, 1)}>+</Button>
            </td>
            <td>{(item.price * item.quantity).toFixed(2)}</td>
            <td>
                <Button variant="danger" onClick={() => onRemove(item)}>Usuń</Button>
            </td>
        </tr>
    );
};

export default CartItem;
