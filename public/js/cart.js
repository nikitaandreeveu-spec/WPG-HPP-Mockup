// Load cart on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    updateCartCount();
});

// Load and display cart items
async function loadCart() {
    try {
        const response = await fetch('/api/cart');
        const cart = await response.json();
        displayCart(cart);
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

// Display cart items
function displayCart(cart) {
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartSummary = document.getElementById('cart-summary');

    if (cart.length === 0) {
        cartItems.innerHTML = '';
        cartEmpty.style.display = 'block';
        cartSummary.style.display = 'none';
        return;
    }

    cartEmpty.style.display = 'none';
    cartSummary.style.display = 'block';
    
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const cartItem = createCartItem(item);
        cartItems.appendChild(cartItem);
    });

    updateCartSummary(cart);
}

// Create cart item element
function createCartItem(item) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    
    div.innerHTML = `
        <div class="cart-item-image">🧀</div>
        <div class="cart-item-details">
            <h4>${item.name}</h4>
            <p class="cart-item-price">€${item.price.toFixed(2)} each</p>
        </div>
        <div class="cart-item-actions">
            <div class="quantity-control">
                <button onclick="updateQuantity(${item.productId}, ${item.quantity - 1})">−</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.productId}, ${item.quantity + 1})">+</button>
            </div>
            <button class="remove-btn" onclick="removeItem(${item.productId})">Remove</button>
        </div>
    `;
    
    return div;
}

// Update item quantity
async function updateQuantity(productId, quantity) {
    if (quantity < 1) {
        removeItem(productId);
        return;
    }

    try {
        const response = await fetch('/api/cart/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId, quantity })
        });

        const result = await response.json();
        if (result.success) {
            displayCart(result.cart);
            updateCartCount();
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
    }
}

// Remove item from cart
async function removeItem(productId) {
    try {
        const response = await fetch(`/api/cart/remove/${productId}`, {
            method: 'DELETE'
        });

        const result = await response.json();
        if (result.success) {
            displayCart(result.cart);
            updateCartCount();
        }
    } catch (error) {
        console.error('Error removing item:', error);
    }
}

// Update cart summary
function updateCartSummary(cart) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 5.00;
    const total = subtotal + shipping;

    document.getElementById('subtotal').textContent = `€${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `€${total.toFixed(2)}`;
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

// Proceed to checkout
function proceedToCheckout() {
    window.location.href = '/checkout';
}
