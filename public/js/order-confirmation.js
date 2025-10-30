// Load order confirmation on page load
document.addEventListener('DOMContentLoaded', () => {
    loadOrderConfirmation();
});

// Load and display order confirmation
async function loadOrderConfirmation() {
    try {
        // Get order ID from URL parameters (if provided by Worldpay)
        const urlParams = new URLSearchParams(window.location.search);
        const cartId = urlParams.get('cartId');
        
        // For demo purposes, we'll try to get the order from session
        // In production, you would use the cartId to fetch order details
        const response = await fetch('/api/cart');
        const data = await response.json();
        
        displayOrderConfirmation();
    } catch (error) {
        console.error('Error loading order confirmation:', error);
        displayGenericConfirmation();
    }
}

// Display order confirmation details
function displayOrderConfirmation() {
    const orderDetails = document.getElementById('order-details');
    
    // Get order info from URL parameters (returned by Worldpay)
    const urlParams = new URLSearchParams(window.location.search);
    const transactionReference = urlParams.get('transactionReference');
    const status = urlParams.get('status');
    
    if (status === 'success' || !status) {
        orderDetails.innerHTML = `
            <h3>Order Details</h3>
            <div class="order-info">
                <p><strong>Order ID:</strong> ${transactionReference || 'Processing...'}</p>
                <p><strong>Status:</strong> <span style="color: #27AE60;">Confirmed</span></p>
                <p><strong>Payment Method:</strong> Worldpay Hosted Payment Pages</p>
            </div>
            <div class="order-info">
                <h4>What's Next?</h4>
                <p>✓ You will receive an order confirmation email shortly</p>
                <p>✓ Your cheese will be carefully packaged</p>
                <p>✓ Delivery typically takes 2-3 business days</p>
            </div>
        `;
    } else {
        orderDetails.innerHTML = `
            <h3>Payment Status</h3>
            <div class="order-info">
                <p style="color: #E74C3C;">There was an issue processing your payment.</p>
                <p>Please contact our support team or try again.</p>
            </div>
        `;
    }
}

// Display generic confirmation if order details unavailable
function displayGenericConfirmation() {
    const orderDetails = document.getElementById('order-details');
    orderDetails.innerHTML = `
        <h3>Thank You!</h3>
        <div class="order-info">
            <p>Your order has been received and is being processed.</p>
            <p>You will receive a confirmation email shortly with your order details.</p>
        </div>
        <div class="order-info">
            <h4>What's Next?</h4>
            <p>✓ You will receive an order confirmation email shortly</p>
            <p>✓ Your cheese will be carefully packaged</p>
            <p>✓ Delivery typically takes 2-3 business days</p>
        </div>
    `;
}
