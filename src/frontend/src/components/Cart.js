import React from 'react';
import { Table } from 'react-bootstrap';
import CartItem from './CartItem';

const Cart = ({ cartItems, onUpdateQuantity, onRemove }) => {
    return (
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>Nazwa produktu</th>
                <th>Cena jednostkowa</th>
                <th>Ilość</th>
                <th>Cena całkowita</th>
                <th>Usuń</th>
            </tr>
            </thead>
            <tbody>
            {cartItems.map(item => (
                <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemove={onRemove}
                />
            ))}
            </tbody>
        </Table>
    );
};

export default Cart;
