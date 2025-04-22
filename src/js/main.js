import { authService } from './auth.js';
import { applyContentProtection } from '../utils/protection.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Apply content protection
    applyContentProtection();
    
    // Check authentication status
    const user = await checkAuthStatus();
    
    // Setup navigation
    setupNavigation(user);
    
    // Setup upload functionality
    setupUploadButton();
    
    // Ensure everything fits on screen
    adjustHeights();
    window.addEventListener('resize', adjustHeights);
});

/**
 * Check if user is logged in and update UI accordingly
 * @returns {Object|null} User object if logged in, null otherwise
 */
async function checkAuthStatus() {
    try {
        const user = await authService.getCurrentUser();
        
        if (user) {
            // User is logged in - update UI accordingly
            updateUIForLoggedInUser(user);
            return user;
        } else {
            // User is not logged in
            updateUIForLoggedOutUser();
            return null;
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
        updateUIForLoggedOutUser();
        return null;
    }
}

/**
 * Update UI for logged in users
 * @param {Object} user - User data
 */
function updateUIForLoggedInUser(user) {
    // Change login button to username display
    const loginButton = document.querySelector('.login-button');
    if (loginButton) {
        // Update the login button to show the username
        loginButton.textContent = user.name;
        loginButton.classList.add('logged-in');
        
        // Create dropdown container
        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown';
        
        // Create dropdown content
        const dropdownContent = document.createElement('div');
        dropdownContent.className = 'dropdown-content';
        
        // ONLY create logout link - NO profile button
        const logoutLink = document.createElement('a');
        logoutLink.href = '#';
        logoutLink.textContent = 'Logout';
        logoutLink.addEventListener('click', handleLogout);
        
        dropdownContent.appendChild(logoutLink);
        
        // Insert the dropdown in the DOM
        const parent = loginButton.parentNode;
        parent.insertBefore(dropdown, loginButton);
        
        // Move the login button inside the dropdown
        dropdown.appendChild(loginButton);
        
        // Add the dropdown content
        dropdown.appendChild(dropdownContent);
        
        // Add click event to toggle dropdown
        loginButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            dropdownContent.classList.toggle('show');
        });
        
        // Close the dropdown if clicked outside
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                dropdownContent.classList.remove('show');
            }
        });
    }
}

/**
 * Update UI for logged out users
 */
function updateUIForLoggedOutUser() {
    const loginButton = document.querySelector('.login-button');
    if (loginButton) {
        loginButton.textContent = 'login';
        loginButton.classList.remove('logged-in');
    }
}

/**
 * Setup navigation button functionality
 * @param {Object|null} user - User data if logged in
 */
function setupNavigation(user) {
    // Login button functionality
    const loginButton = document.querySelector('.login-button');
    if (loginButton && !user) {
        loginButton.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }
    
    // Instructions button
    const instructionsButton = document.querySelector('.instructions-button');
    if (instructionsButton) {
        instructionsButton.addEventListener('click', function() {
            // Redirect to instructions page
            alert('Instructions page coming soon!');
        });
    }
    
    // Disclaimer button
    const disclaimerButton = document.querySelector('.disclaimer-button');
    if (disclaimerButton) {
        disclaimerButton.addEventListener('click', function() {
            // Redirect to disclaimer page
            window.location.href = 'disclaimer.html';
        });
    }
}

/**
 * Handle user logout
 * @param {Event} e - Click event
 */
async function handleLogout(e) {
    e.preventDefault();
    
    try {
        await authService.logout();
        window.location.reload();
    } catch (error) {
        console.error('Logout error:', error);
        alert('Failed to logout. Please try again.');
    }
}

/**
 * Setup upload button functionality
 */
function setupUploadButton() {
    const uploadBtn = document.querySelector('.upload-btn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            // Check if user is logged in first
            authService.isLoggedIn().then(isLoggedIn => {
                if (!isLoggedIn) {
                    // Redirect to login if not authenticated
                    window.location.href = 'login.html';
                    return;
                }
                
                // Trigger file upload dialog
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = '.csv, .json';
                fileInput.style.display = 'none';
                document.body.appendChild(fileInput);
                
                fileInput.click();
                
                fileInput.addEventListener('change', function() {
                    if (this.files && this.files.length > 0) {
                        // Handle file upload logic
                        processFile(this.files[0]);
                    }
                    document.body.removeChild(fileInput);
                });
            }).catch(error => {
                console.error('Error checking login status:', error);
                window.location.href = 'login.html';
            });
        });
    }
}

/**
 * Process uploaded file
 * @param {File} file - Uploaded file
 */
function processFile(file) {
    // Here you would implement the actual file processing
    // For now, just show a message
    alert(`File selected: ${file.name}\nThis will be processed in a future update.`);
}

/**
 * Adjust heights to ensure everything fits on screen
 */
function adjustHeights() {
    const container = document.querySelector('.container');
    const header = document.querySelector('.header');
    const content = document.querySelector('.content');
    const footer = document.querySelector('.footer');
    
    // Set content height to fill available space
    const availableHeight = container.offsetHeight - header.offsetHeight - footer.offsetHeight;
    content.style.height = `${availableHeight}px`;
    
    // Adjust image and text sizes based on available content space
    const contentInner = document.querySelector('.content-inner');
    const leftSide = document.querySelector('.left-side');
    const rightSide = document.querySelector('.right-side');
    const featuredImg = document.querySelector('.featured-img');
    
    if (featuredImg) {
        const maxImgHeight = content.offsetHeight * 0.85;
        featuredImg.style.maxHeight = `${maxImgHeight}px`;
    }
    
    // Adjust upload button based on content height
    const uploadBtn = document.querySelector('.upload-btn');
    if (uploadBtn) {
        const contentHeight = content.offsetHeight;
        const buttonHeight = Math.min(Math.max(contentHeight * 0.12, 80), 120);
        uploadBtn.style.height = `${buttonHeight}px`;
    }
}