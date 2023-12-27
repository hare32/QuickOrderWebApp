import axios from 'axios';

const API_URL = 'http://localhost:3000/products';

export const getProducts = async () => {
    return await axios.get(API_URL);
};

export const createProduct = async (productData) => {
    return await axios.post(API_URL, productData);
};
