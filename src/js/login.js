import { authService } from './auth.js';
import { applyContentProtection, setupPasswordToggle } from '../utils/protection.js';

document.addEventListener('DOMContentLoaded', () => {
    // Apply content protection
    applyContentProtection();
    
    // Setup password toggle
    setupPasswordToggle('.toggle-password', '#password');
    
    // Check if user is already logged in
    checkAuthStatus();
    
    // Setup login form
    setupLoginForm();
    
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
 * Setup login form submission
 */
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember').checked;
            
            // Basic validation
            if (!email || !password) {
                showError('Please enter both email and password');
                return;
            }
            
            // Update UI
            const loginBtn = document.querySelector('.login-btn');
            loginBtn.textContent = 'Logging in...';
            loginBtn.disabled = true;
            
            try {
                // Attempt login
                await authService.login(email, password);
                
                // Store remember me preference if checked
                if (rememberMe) {
                    localStorage.setItem('rememberUser', 'true');
                    localStorage.setItem('userEmail', email);
                } else {
                    localStorage.removeItem('rememberUser');
                    localStorage.removeItem('userEmail');
                }
                
                // Redirect on success
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Login error:', error);
                
                // Handle common errors
                if (error.code === 401) {
                    showError('Invalid email or password');
                } else {
                    showError('Login failed. Please try again.');
                }
                
                // Reset button
                loginBtn.textContent = 'Login';
                loginBtn.disabled = false;
            }
        });
        
        // Check for remembered user
        const rememberedUser = localStorage.getItem('rememberUser');
        const userEmail = localStorage.getItem('userEmail');
        
        if (rememberedUser && userEmail) {
            document.getElementById('email').value = userEmail;
            document.getElementById('remember').checked = true;
        }
    }
}
/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    // Check if error element exists, create if not
    let errorElement = document.querySelector('.login-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'login-error';
        const form = document.getElementById('login-form');
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
    const loginContainer = document.querySelector('.login-container');
    const content = document.querySelector('.content');
    const footer = document.querySelector('.footer');
    
    // Get available height for content
    const availableHeight = window.innerHeight - footer.offsetHeight;
    
    // Calculate content height including title and form
    const contentHeight = loginContainer.offsetHeight;
    
    // If content doesn't fit, scale it down
    if (contentHeight > availableHeight) {
        const scale = (availableHeight / contentHeight) * 0.9; // Add some padding
        loginContainer.style.transform = `scale(${scale})`;
    }
}