const express = require('express');
const router = express.Router();
const axios = require('axios');

// Worldpay HPP API configuration
const WORLDPAY_CONFIG = {
  apiUrl: process.env.WORLDPAY_API_URL || 'https://try.access.worldpay.com/payment_pages',
  merchantEntity: process.env.WORLDPAY_MERCHANT_ENTITY,
  username: process.env.WORLDPAY_USERNAME,
  password: process.env.WORLDPAY_PASSWORD,
  successUrl: process.env.SUCCESS_URL || 'http://localhost:3000/order-confirmation',
  cancelUrl: process.env.CANCEL_URL || 'http://localhost:3000/checkout',
  errorUrl: process.env.ERROR_URL || 'http://localhost:3000/checkout?error=payment',
  failureUrl: process.env.FAILURE_URL || 'http://localhost:3000/checkout?error=payment'
};

// Create Worldpay HPP payment order
router.post('/create-order', async (req, res) => {
  const { customerInfo } = req.body;
  const cart = req.session.cart || [];

  if (cart.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  // Calculate total (Worldpay uses minor currency units - cents)
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 5.00;
  const total = subtotal + shipping;
  const amountInCents = Math.round(total * 100); // Convert to cents
  
  const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Store order info in session
  req.session.order = {
    orderId,
    customerInfo,
    items: cart,
    total,
    createdAt: new Date().toISOString()
  };
  req.session.save();

  // Split customer name into first and last name
  const nameParts = customerInfo.name.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Prepare Worldpay HPP API request body
  const worldpayRequest = {
    transactionReference: orderId,
    merchant: {
      entity: WORLDPAY_CONFIG.merchantEntity
    },
    narrative: {
      line1: 'Dutch Cheese Shop'
    },
    value: {
      currency: 'EUR',
      amount: amountInCents
    },
    description: 'Dutch Cheese Purchase',
    billingAddress: {
      firstName: firstName,
      lastName: lastName,
      address1: customerInfo.address,
      city: customerInfo.city,
      postalCode: customerInfo.postalCode,
      countryCode: customerInfo.country
    },
    resultURLs: {
      successURL: WORLDPAY_CONFIG.successUrl,
      cancelURL: WORLDPAY_CONFIG.cancelUrl,
      failureURL: WORLDPAY_CONFIG.failureUrl,
      errorURL: WORLDPAY_CONFIG.errorUrl
    }
  };

  try {
    // Create Basic Auth header
    const auth = Buffer.from(`${WORLDPAY_CONFIG.username}:${WORLDPAY_CONFIG.password}`).toString('base64');
    
    // Make API call to Worldpay
    const response = await axios.post(WORLDPAY_CONFIG.apiUrl, worldpayRequest, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/vnd.worldpay.payment_pages-v1.hal+json',
        'Accept': 'application/vnd.worldpay.payment_pages-v1.hal+json',
        'WP-CorrelationId': orderId
      }
    });

    // Extract payment URL from response
    const paymentUrl = response.data.url;

    res.json({
      success: true,
      orderId,
      redirectUrl: paymentUrl
    });

  } catch (error) {
    console.error('Worldpay API Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to create payment session',
      details: error.response?.data || error.message
    });
  }
});

// Worldpay callback handler (webhook for payment notifications)
router.post('/callback', (req, res) => {
  console.log('Worldpay callback received:', req.body);
  
  // In production, verify the callback authenticity here
  
  const {
    transactionReference,
    status
  } = req.body;

  if (status === 'success') {
    console.log(`Payment successful for order: ${transactionReference}`);
    // Here you would typically:
    // 1. Update order status in database
    // 2. Send confirmation email
    // 3. Process fulfillment
  } else {
    console.log(`Payment failed for order: ${transactionReference}`);
  }

  res.status(200).send('OK');
});

// Get order confirmation
router.get('/order/:orderId', (req, res) => {
  if (req.session.order && req.session.order.orderId === req.params.orderId) {
    res.json(req.session.order);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

module.exports = router;
