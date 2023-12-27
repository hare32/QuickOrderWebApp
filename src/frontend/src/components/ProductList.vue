<template>
  <div>
    <h1>Produkty</h1>
    <ul>
      <li v-for="product in products" :key="product.id">{{ product.name }}</li>
    </ul>
  </div>
</template>

<script>
import { getProducts } from '../api/products';

export default {
  data() {
    return {
      products: []
    };
  },
  async created() {
    try {
      const response = await getProducts();
      this.products = response.data;
    } catch (error) {
      console.error(error);
    }
  }
};
</script>
