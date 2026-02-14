// Shopping Cart Array
let cart = [];

// Load cart from localStorage on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    updateCartCount();
});

// Add to Cart Function
function addToCart(productName, price, image) {
    // Check if product already exists in cart
    const existingProduct = cart.find(item => item.name === productName);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification('Product added to cart!');
}

// Remove from Cart
function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    saveCart();
    updateCartCount();
    displayCart();
}

// Update Quantity
function updateQuantity(productName, change) {
    const product = cart.find(item => item.name === productName);
    if (product) {
        product.quantity += change;
        if (product.quantity <= 0) {
            removeFromCart(productName);
        } else {
            saveCart();
            displayCart();
            updateCartCount();
        }
    }
}

// Calculate Total
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Update Cart Count Badge
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartBadge = document.getElementById('cart-count');
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Display Cart Modal
function displayCart() {
    const cartModal = document.getElementById('cart-modal');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItems) return;
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '0 L.E';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>${item.price} L.E</p>
            </div>
            <div class="cart-item-controls">
                <button onclick="updateQuantity('${item.name}', -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity('${item.name}', 1)">+</button>
            </div>
            <div class="cart-item-total">
                ${item.price * item.quantity} L.E
            </div>
            <button class="remove-btn" onclick="removeFromCart('${item.name}')">×</button>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = calculateTotal().toFixed(2) + ' L.E';
}

// Toggle Cart Modal
function toggleCart() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal.style.display === 'block') {
        cartModal.style.display = 'none';
    } else {
        cartModal.style.display = 'block';
        displayCart();
    }
}

// Close cart when clicking outside
window.onclick = function(event) {
    const cartModal = document.getElementById('cart-modal');
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
}

// Checkout Function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = calculateTotal();
    alert(`Thank you for your order!\nTotal: ${total.toFixed(2)} L.E\n\nYour order has been placed successfully!`);
    
    // Clear cart after checkout
    cart = [];
    saveCart();
    updateCartCount();
    displayCart();
    toggleCart();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('banhaStoreCart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('banhaStoreCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Search Functionality
function searchProducts() {
    const searchInput = document.querySelector('.search-box input');
    const searchTerm = searchInput.value.toLowerCase();
    const products = document.querySelectorAll('.BlueShirt');
    
    products.forEach(product => {
        const productName = product.querySelector('h4').textContent.toLowerCase();
        
        if (productName.includes(searchTerm)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Add to Cart buttons
    const addButtons = document.querySelectorAll('.BlueShirt button');
    
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.BlueShirt');
            const productName = productCard.querySelector('h4').textContent;
            const priceText = productCard.querySelector('span').textContent;
            const price = parseFloat(priceText.replace('L.E', ''));
            const image = productCard.querySelector('img').src;
            
            addToCart(productName, price, image);
        });
    });
    
    // Initialize Search
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    
    // Search as you type (live search)
    if (searchInput) {
        searchInput.addEventListener('input', searchProducts);
    }
    
    // Search when clicking the button
    if (searchButton) {
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            searchProducts();
        });
    }
    
    // Search when pressing Enter
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchProducts();
            }
        });
    }
});