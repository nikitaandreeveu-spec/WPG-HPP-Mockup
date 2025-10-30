# 🧀 Dutch Cheese Shop

A mockup ecommerce application for selling premium Dutch cheese, featuring **Worldpay Hosted Payment Pages (HPP)** integration for secure payment processing.

## 📋 Overview

This is a full-stack Node.js web application that demonstrates:
- Product catalog for Dutch cheese varieties
- Shopping cart functionality with session management
- Worldpay Hosted Payment Pages integration
- Order confirmation system

## 🛠️ Technology Stack

- **Backend**: Node.js + Express.js
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Payment**: Worldpay Hosted Payment Pages API
- **Session**: express-session

## 📁 Project Structure

```
hpp mockup access/
├── .github/
│   └── copilot-instructions.md    # Workspace instructions
├── data/
│   └── products.js                # Product catalog data
├── routes/
│   ├── products.js                # Product API routes
│   ├── cart.js                    # Shopping cart routes
│   └── checkout.js                # Checkout & Worldpay integration
├── public/
│   ├── css/
│   │   └── styles.css             # Application styles
│   ├── js/
│   │   ├── app.js                 # Product listing logic
│   │   ├── cart.js                # Cart management
│   │   ├── checkout.js            # Checkout & payment
│   │   └── order-confirmation.js  # Order confirmation
│   ├── index.html                 # Product catalog page
│   ├── cart.html                  # Shopping cart page
│   ├── checkout.html              # Checkout page
│   └── order-confirmation.html    # Order confirmation page
├── server.js                      # Express server setup
├── package.json                   # Dependencies
├── .env.example                   # Environment variables template
└── README.md                      # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- Worldpay merchant account (for production use)

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd "hpp mockup access"
   ```

2. **Install dependencies** (already done):
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Worldpay credentials:
   ```env
   # API Endpoint
   WORLDPAY_API_URL=https://try.access.worldpay.com/payment_pages
   
   # Your credentials from Worldpay
   WORLDPAY_MERCHANT_ENTITY=POxxxxxxxxx
   WORLDPAY_USERNAME=your_username
   WORLDPAY_PASSWORD=your_password
   
   PORT=3000
   SESSION_SECRET=your_session_secret_here
   
   BASE_URL=http://localhost:3000
   SUCCESS_URL=http://localhost:3000/order-confirmation
   CANCEL_URL=http://localhost:3000/checkout
   ERROR_URL=http://localhost:3000/checkout?error=payment
   FAILURE_URL=http://localhost:3000/checkout?error=payment
   ```

4. **Start the server**:
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

## � Deploying to Production (Railway)

### Quick Deployment

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Run the deployment script**:
   ```bash
   chmod +x deploy-railway.sh
   ./deploy-railway.sh
   ```
   
   Or manually follow steps in `RAILWAY_DEPLOYMENT.md`

3. **Update URLs after deployment**:
   ```bash
   # Replace YOUR_URL with your Railway domain
   railway variables set BASE_URL=https://YOUR_URL.railway.app
   railway variables set SUCCESS_URL=https://YOUR_URL.railway.app/order-confirmation
   railway variables set CANCEL_URL=https://YOUR_URL.railway.app/checkout
   railway variables set ERROR_URL=https://YOUR_URL.railway.app/checkout?error=payment
   railway variables set FAILURE_URL=https://YOUR_URL.railway.app/checkout?error=payment
   ```

4. **Redeploy with updated URLs**:
   ```bash
   railway up
   ```

5. **Update Worldpay Dashboard** with your new Railway URLs

See `RAILWAY_DEPLOYMENT.md` for detailed instructions.

## �💳 Worldpay HPP Integration

### How It Works

1. **Customer adds products to cart** and proceeds to checkout
2. **Customer enters shipping information** on the checkout page
3. **Application sends API request to Worldpay** to create a payment session
   - POST request to `/payment_pages` endpoint
   - Includes transaction details, amount, customer info
4. **Worldpay returns a hosted payment URL**
5. **Customer is redirected to Worldpay's secure payment page** (Hosted Payment Pages)
6. **Customer completes payment** on Worldpay's interface
7. **Worldpay redirects back** to your success/failure URL with transaction details
8. **Application displays order confirmation**

### Integration Reference

This implementation follows the **correct** Worldpay HPP API documentation:
- **API Reference**: https://developer.worldpay.com/products/hosted-payment-pages/openapi/other/create
- **Method**: REST API with JSON payload
- **Endpoint**: `POST /payment_pages`

### Authentication

Worldpay HPP uses **Basic Authentication**:
- Username and password provided by your Implementation Manager
- Sent as Base64-encoded `Authorization` header
- Required headers:
  - `Authorization: Basic <base64credentials>`
  - `Content-Type: application/vnd.worldpay.payment_pages-v1.hal+json`
  - `Accept: application/vnd.worldpay.payment_pages-v1.hal+json`
  - `WP-CorrelationId: <unique-request-id>`

### Key API Request Parameters

The application sends these parameters to Worldpay:

```json
{
  "transactionReference": "YOUR_UNIQUE_ORDER_ID",
  "merchant": {
    "entity": "YOUR_MERCHANT_ENTITY"
  },
  "narrative": {
    "line1": "Dutch Cheese Shop"
  },
  "value": {
    "currency": "EUR",
    "amount": 2500  // Amount in minor currency units (cents)
  },
  "billingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Main St",
    "city": "Amsterdam",
    "postalCode": "1012",
    "countryCode": "NL"
  },
  "resultURLs": {
    "successURL": "https://yoursite.com/order-confirmation",
    "cancelURL": "https://yoursite.com/checkout",
    "failureURL": "https://yoursite.com/checkout?error=payment",
    "errorURL": "https://yoursite.com/checkout?error=payment"
  }
}
```

### API Response

Worldpay returns a JSON response with a payment URL:

```json
{
  "url": "https://payments.worldpay.com/app/hpp/integration/transaction/xxxxx",
  "_links": {
    "self": {
      "href": "https://access.worldpay.com/paymentQueries/payments?transactionReference=..."
    }
  }
}
```

You redirect the customer to this `url` to complete the payment.

### Test Mode vs Production

**Test Environment:**
- URL: `https://try.access.worldpay.com/payment_pages`
- Use test credentials from Worldpay
- Test cards accepted

**Production Environment:**
- URL: `https://access.worldpay.com/payment_pages`
- Use production credentials
- Real transactions processed

### Production Checklist

Before going live:

- [ ] Update Worldpay API URL to production: `https://access.worldpay.com/payment_pages`
- [ ] Update credentials in `.env` to production values (entity, username, password)
- [ ] Set up DNS whitelisting for `https://access.worldpay.com/`
- [ ] Configure webhook/callback URL if needed (for server-to-server notifications)
- [ ] Add proper database for order persistence
- [ ] Set up SSL/HTTPS for secure communication
- [ ] Update all URLs (BASE_URL, SUCCESS_URL, etc.) to production domains
- [ ] Implement email notifications for order confirmations
- [ ] Add proper error handling and logging
- [ ] Test with real Worldpay test cards
- [ ] Review security best practices

## 🎨 Features

### Product Catalog
- Display of Dutch cheese varieties
- Product details (name, description, price, category, weight)
- "Add to Cart" functionality

### Shopping Cart
- View all items in cart
- Update quantities
- Remove items
- Real-time price calculation
- Persistent cart using sessions

### Checkout
- Customer information form
- Order summary
- Secure redirect to Worldpay HPP
- Multiple country support

### Order Confirmation
- Order details display
- Transaction ID (from Worldpay)
- Next steps information

## 🧪 Testing

### Test the Application

1. Start the server: `npm start`
2. Open http://localhost:3000
3. Browse products and add them to cart
4. Go to cart and proceed to checkout
5. Fill in shipping information
6. Click "Continue to Payment" to test Worldpay integration

### Test Cards

When in test mode, use Worldpay's test card numbers:
- **Visa**: 4444333322221111
- **Mastercard**: 5555555555554444
- Any future expiry date and any CVV

## 📦 Available Products

The shop includes 6 Dutch cheese varieties:

1. **Gouda** - Classic Dutch cheese (€12.99)
2. **Edam** - Semi-hard cheese (€10.99)
3. **Aged Gouda** - 24-month aged premium (€24.99)
4. **Maasdam** - Swiss-style with holes (€11.99)
5. **Leyden** - Spiced with cumin (€14.99)
6. **Smoked Gouda** - Distinctive smoky flavor (€15.99)

## 🔒 Security Considerations

This is a **mockup/demo application**. For production use:

1. **Environment Variables**: Never commit `.env` file
2. **Session Secret**: Use a strong, random session secret
3. **HTTPS**: Always use SSL/HTTPS in production
4. **Input Validation**: Add server-side validation for all user inputs
5. **Callback Verification**: Implement Worldpay callback signature verification
6. **Database**: Use a proper database instead of session storage
7. **Authentication**: Add user authentication if needed
8. **Rate Limiting**: Implement rate limiting to prevent abuse

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 is already in use, change the `PORT` in `.env`:
```env
PORT=3001
```

### Worldpay Integration Issues
- Verify your merchant credentials are correct (entity, username, password)
- Check that you're using the correct API endpoint (test vs production)
- Ensure all required fields are provided in the API request
- Check Worldpay developer portal for transaction logs
- Verify Basic Auth credentials are properly encoded

### Session Issues
- Clear browser cookies
- Restart the server
- Check that `SESSION_SECRET` is set in `.env`

## 📝 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product

### Cart
- `GET /api/cart` - Get cart contents
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update item quantity
- `DELETE /api/cart/remove/:productId` - Remove item
- `DELETE /api/cart/clear` - Clear cart

### Checkout
- `POST /api/checkout/create-order` - Create order and get HPP parameters
- `POST /api/checkout/callback` - Worldpay callback handler
- `GET /api/checkout/order/:orderId` - Get order details

## 📄 License

This is a demo/mockup application for educational purposes.

## 🤝 Support

For Worldpay HPP documentation and support:
- [Worldpay Developer Portal](https://developer.worldpay.com)
- [HPP Integration Guide](https://developer.worldpay.com/products/hosted-payment-pages)

## 📧 Contact

For questions about this implementation, please refer to the Worldpay documentation or create an issue in the repository.

---

**Note**: This is a mockup application. Before deploying to production, implement proper security measures, database integration, and follow all Worldpay integration best practices.
