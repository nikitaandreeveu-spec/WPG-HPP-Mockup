const express = require('express');
const router = express.Router();
const products = require('../data/products');

// Get all products
router.get('/', (req, res) => {
  res.json(products);
});

// Get single product by ID
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

module.exports = router;
