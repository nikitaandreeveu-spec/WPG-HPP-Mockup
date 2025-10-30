// Load products and update cart count on page load
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCartCount();
});

// Load and display products
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Display products in grid
function displayProducts(products) {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <div class="product-image">🧀</div>
        <div class="product-info">
            <h4>${product.name}</h4>
            <p class="product-category">${product.category} • ${product.weight}</p>
            <p>${product.description}</p>
            <div class="product-footer">
                <span class="product-price">€${product.price.toFixed(2)}</span>
                <button class="btn btn-primary" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Add product to cart
async function addToCart(productId) {
    try {
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: productId,
                quantity: 1
            })
        });

        const result = await response.json();
        
        if (result.success) {
            updateCartCount();
            showNotification('Product added to cart!');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Error adding product to cart', 'error');
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

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27AE60' : '#E74C3C'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
