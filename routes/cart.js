const express = require('express');
const router = express.Router();
const products = require('../data/products');

// Get cart contents
router.get('/', (req, res) => {
  res.json(req.session.cart || []);
});

// Add item to cart
router.post('/add', (req, res) => {
  const { productId, quantity } = req.body;
  const product = products.find(p => p.id === parseInt(productId));
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const existingItem = req.session.cart.find(item => item.productId === parseInt(productId));
  
  if (existingItem) {
    existingItem.quantity += parseInt(quantity) || 1;
  } else {
    req.session.cart.push({
      productId: parseInt(productId),
      name: product.name,
      price: product.price,
      quantity: parseInt(quantity) || 1,
      image: product.image
    });
  }
  
  req.session.save();
  res.json({ success: true, cart: req.session.cart });
});

// Update cart item quantity
router.put('/update', (req, res) => {
  const { productId, quantity } = req.body;
  const item = req.session.cart.find(item => item.productId === parseInt(productId));
  
  if (item) {
    item.quantity = parseInt(quantity);
    if (item.quantity <= 0) {
      req.session.cart = req.session.cart.filter(i => i.productId !== parseInt(productId));
    }
    req.session.save();
    res.json({ success: true, cart: req.session.cart });
  } else {
    res.status(404).json({ error: 'Item not found in cart' });
  }
});

// Remove item from cart
router.delete('/remove/:productId', (req, res) => {
  req.session.cart = req.session.cart.filter(
    item => item.productId !== parseInt(req.params.productId)
  );
  req.session.save();
  res.json({ success: true, cart: req.session.cart });
});

// Clear cart
router.delete('/clear', (req, res) => {
  req.session.cart = [];
  req.session.save();
  res.json({ success: true });
});

module.exports = router;
