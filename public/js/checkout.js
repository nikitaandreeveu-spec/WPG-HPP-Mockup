// Load cart and setup form on page load
document.addEventListener('DOMContentLoaded', () => {
    loadOrderSummary();
    updateCartCount();
    setupCheckoutForm();
});

// Load order summary
async function loadOrderSummary() {
    try {
        const response = await fetch('/api/cart');
        const cart = await response.json();
        
        if (cart.length === 0) {
            window.location.href = '/cart';
            return;
        }
        
        displayOrderSummary(cart);
    } catch (error) {
        console.error('Error loading order summary:', error);
    }
}

// Display order summary
function displayOrderSummary(cart) {
    const orderItems = document.getElementById('order-items');
    orderItems.innerHTML = '';
    
    cart.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div>
                <strong>${item.name}</strong>
                <p>Quantity: ${item.quantity}</p>
            </div>
            <div>
                <strong>€${(item.price * item.quantity).toFixed(2)}</strong>
            </div>
        `;
        orderItems.appendChild(orderItem);
    });
    
    updateOrderTotals(cart);
}

// Update order totals
function updateOrderTotals(cart) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 5.00;
    const total = subtotal + shipping;
    
    document.getElementById('subtotal').textContent = `€${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `€${total.toFixed(2)}`;
}

// Setup checkout form
function setupCheckoutForm() {
    const form = document.getElementById('checkout-form');
    form.addEventListener('submit', handleCheckout);
}

// Handle checkout submission
async function handleCheckout(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const customerInfo = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        city: formData.get('city'),
        postalCode: formData.get('postalCode'),
        country: formData.get('country')
    };
    
    // Disable submit button
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
    
    try {
        // Create order with backend
        const response = await fetch('/api/checkout/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ customerInfo })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Redirect to Worldpay HPP
            window.location.href = result.redirectUrl;
        } else {
            alert(result.error || 'Error creating order. Please try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    } catch (error) {
        console.error('Error during checkout:', error);
        alert('An error occurred. Please try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Update cart count in header
async function updateCartCount() {
    try {
        const response = await fetch('/api/cart');
        const cart = await response.json();
        
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cart-count').textContent = totalItems;
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}
