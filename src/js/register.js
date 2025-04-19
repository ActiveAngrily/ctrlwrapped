import { authService } from './auth.js';
import { applyContentProtection, setupPasswordToggle } from '../utils/protection.js';

document.addEventListener('DOMContentLoaded', () => {
    // Apply content protection
    applyContentProtection();
    
    // Setup password toggle
    setupPasswordToggle('.toggle-password', '#password');
    
    // Check if user is already logged in
    checkAuthStatus();
    
    // Setup registration form
    setupRegisterForm();
    
    // Ensure layout fits on screen
    adjustLayout();
    window.addEventListener('resize', adjustLayout);
});

/**
 * Check authentication status and redirect if needed
 */
async function checkAuthStatus() {
    try {
        const isLoggedIn = await authService.isLoggedIn();
        if (isLoggedIn) {
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
    }
}

/**
 * Setup registration form submission
 */
function setupRegisterForm() {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const username = document.getElementById('username').value;
            
            // Basic validation
            if (!email || !password || !username) {
                showError('Please fill in all fields');
                return;
            }
            
            // Password strength validation
            if (password.length < 8) {
                showError('Password must be at least 8 characters long');
                return;
            }
            
            // Update UI
            const registerBtn = document.querySelector('.register-btn');
            registerBtn.textContent = 'Creating Account...';
            registerBtn.disabled = true;
            
            try {
                // Attempt to create account
                await authService.createAccount(email, password, username);
                
                // Redirect on success
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Registration error:', error);
                
                // Handle common errors
                if (error.code === 409) {
                    showError('Email or username already exists');
                } else if (error.message.includes('password')) {
                    showError('Password is too weak. Use at least 8 characters with numbers and special characters');
                } else {
                    showError('Registration failed. Please try again.');
                }
                
                // Reset button
                registerBtn.textContent = 'Create Account';
                registerBtn.disabled = false;
            }
        });
    }
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    // Check if error element exists, create if not
    let errorElement = document.querySelector('.register-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'register-error';
        const form = document.getElementById('register-form');
        form.insertBefore(errorElement, form.firstChild);
    }
    
    // Show error
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Hide after 5 seconds
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

/**
 * Adjust layout to fit on screen
 */
function adjustLayout() {
    const container = document.querySelector('.container');
    const registerContainer = document.querySelector('.register-container');
    const content = document.querySelector('.content');
    const footer = document.querySelector('.footer');
    
    // Get available height for content
    const availableHeight = window.innerHeight - footer.offsetHeight;
    
    // Calculate content height including title and form
    const contentHeight = registerContainer.offsetHeight;
    
    // If content doesn't fit, scale it down
    if (contentHeight > availableHeight) {
        const scale = (availableHeight / contentHeight) * 0.9; // Add some padding
        registerContainer.style.transform = `scale(${scale})`;
    }
}