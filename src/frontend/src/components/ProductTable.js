import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';

const ProductTable = ({ products, onAddToCart }) => {
    const [filter, setFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/categories')
            .then(response => response.json())
            .then(data => setCategories(data));
    }, []);

    const filteredProducts = products.filter(product => {
        return product.name.toLowerCase().includes(filter.toLowerCase()) &&
            (categoryFilter === '' || product.category_id === parseInt(categoryFilter));
    });

    return (
        <div>
            <input
                type="text"
                placeholder="Filtruj po nazwie..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
            />
            <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}>
                <option value="">Wszystkie kategorie</option>
                {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                ))}
            </select>

            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Nazwa</th>
                    <th>Opis</th>
                    <th>Cena jednostkowa</th>
                    <th>Akcje</th>
                </tr>
                </thead>
                <tbody>
                {filteredProducts.map(product => (
                    <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.description}</td>
                        <td>{product.unit_price}</td>
                        <td>
                            <Button onClick={() => onAddToCart(product)}>Kup</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ProductTable;
