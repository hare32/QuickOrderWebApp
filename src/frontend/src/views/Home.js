import React, { useState, useEffect } from 'react';
import ProductTable from '../components/ProductTable';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        // Pobranie produktów z API
        fetch('http://localhost:3000/products')
            .then(response => response.json())
            .then(data => setProducts(data));
    }, []);

    const handleAddToCart = (product) => {
        // Sprawdzenie, czy produkt jest już w koszyku
        const existingItem = cartItems.find(item => item.id === product.id);

        if (existingItem) {
            // Zwiększenie ilości, jeśli produkt już jest w koszyku
            setCartItems(cartItems.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            // Dodanie nowego produktu do koszyka, jeśli jeszcze go tam nie ma
            setCartItems([...cartItems, { ...product, quantity: 1 }]);
        }
    };

    return (
        <div>
            <ProductTable products={products} onAddToCart={handleAddToCart} />
        </div>
    );
};

export default Home;
