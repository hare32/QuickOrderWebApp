import React from 'react';
import { Table, Button } from 'react-bootstrap';

const ProductTable = ({ products, onAddToCart }) => {
    // Implementacja filtrowania i wyświetlania produktów
    return (
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>Nazwa</th>
                <th>Opis</th>
                <th>Cena</th>
                <th>Akcje</th>
            </tr>
            </thead>
            <tbody>
            {products.map(product => (
                <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>{product.price}</td>
                    <td>
                        <Button onClick={() => onAddToCart(product)}>Kup</Button>
                    </td>
                </tr>
            ))}
            </tbody>
        </Table>
    );
};

export default ProductTable;
