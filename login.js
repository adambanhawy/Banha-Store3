// Switch to Signup Modal
function switchToSignup() {
    document.getElementById('signup-modal').style.display = 'block';
}

// Close Signup Modal
function closeSignup() {
    document.getElementById('signup-modal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('signup-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Show message (success or error)
function showMessage(message, type, formId) {
    const form = document.getElementById(formId);
    
    // Remove existing messages
    const existingMsg = form.querySelector('.message');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.textContent = message;
    
    form.insertBefore(messageDiv, form.firstChild);
    
    // Remove message after 4 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 4000);
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Handle Login
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    // Validation
    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address', 'error', 'login-form');
        return;
    }
    
    if (!password) {
        showMessage('Please enter your password', 'error', 'login-form');
        return;
    }
    
    // Check credentials
    const users = JSON.parse(localStorage.getItem('banhaStoreUsers') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        showMessage('Invalid email or password', 'error', 'login-form');
        return;
    }
    
    // Login successful
    const loginData = {
        name: user.name,
        email: user.email,
        loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('banhaStoreCurrentUser', JSON.stringify(loginData));
    
    showMessage('Login successful! Redirecting...', 'success', 'login-form');
    
    // Redirect to home page after 1.5 seconds
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1500);
});

// Handle Signup
document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const termsAccepted = document.getElementById('terms').checked;
    
    // Validation
    if (!name) {
        showMessage('Please enter your full name', 'error', 'signup-form');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address', 'error', 'signup-form');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long', 'error', 'signup-form');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error', 'signup-form');
        return;
    }
    
    if (!termsAccepted) {
        showMessage('Please accept the Terms & Conditions', 'error', 'signup-form');
        return;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('banhaStoreUsers') || '[]');
    const userExists = users.find(user => user.email === email);
    
    if (userExists) {
        showMessage('Email already registered. Please login.', 'error', 'signup-form');
        return;
    }
    
    // Create new user
    const newUser = {
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('banhaStoreUsers', JSON.stringify(users));
    
    showMessage('Account created successfully! Redirecting to login...', 'success', 'signup-form');
    
    // Clear form
    document.getElementById('signup-form').reset();
    
    // Close modal and pre-fill email in login form
    setTimeout(() => {
        closeSignup();
        document.getElementById('login-email').value = email;
    }, 2000);
});

// Social Login Buttons (Demo - just shows alert)
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const platform = this.classList.contains('google-btn') ? 'Google' :
                        this.classList.contains('facebook-btn') ? 'Facebook' : 'Microsoft';
        alert(`${platform} login coming soon!`);
    });
});

// Forgot Password
document.querySelector('.forgot-link').addEventListener('click', function(e) {
    e.preventDefault();
    
    const email = prompt('Please enter your email address:');
    
    if (email && isValidEmail(email)) {
        const users = JSON.parse(localStorage.getItem('banhaStoreUsers') || '[]');
        const user = users.find(u => u.email === email);
        
        if (user) {
            alert(`Password reset link sent to ${email}\n\nFor demo purposes, your password is: ${user.password}`);
        } else {
            alert('No account found with this email address.');
        }
    } else if (email) {
        alert('Please enter a valid email address.');
    }
});

// Check if user is already logged in
window.addEventListener('load', function() {
    const currentUser = localStorage.getItem('banhaStoreCurrentUser');
    
    if (currentUser) {
        // User is already logged in, redirect to home
        window.location.href = '../index.html';
    }
});

// Prevent modal from closing when clicking inside it
document.querySelector('.modal-content').addEventListener('click', function(e) {
    e.stopPropagation();
}); 