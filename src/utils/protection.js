/**
 * Applies content protection to prevent copying and interactions
 * with non-interactive elements
 */
export function applyContentProtection() {
    // Prevent right-click context menu
    document.addEventListener('contextmenu', event => event.preventDefault());
    
    // Prevent image drag and save
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', event => event.preventDefault());
        img.setAttribute('draggable', 'false');
    });
    
    // Prevent text selection except on inputs, buttons and links
    document.addEventListener('selectstart', function(e) {
        const allowedElements = ['INPUT', 'TEXTAREA'];
        const allowedParents = ['.social-icons', 'BUTTON', 'A', 'LABEL', 'FORM'];
        
        if (!allowedElements.includes(e.target.tagName) && 
            !allowedParents.some(selector => e.target.closest(selector))) {
            e.preventDefault();
        }
    });
    
    // Prevent keyboard shortcuts except in form elements
    document.addEventListener('keydown', function(e) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            // Prevent Ctrl+S, Ctrl+P, Ctrl+Shift+I
            if ((e.ctrlKey && (e.key === 's' || e.key === 'p')) || 
                (e.ctrlKey && e.shiftKey && e.key === 'i')) {
                e.preventDefault();
            }
        }
    });
}

/**
 * Adds toggle functionality to password fields
 * @param {string} toggleSelector - CSS selector for toggle button
 * @param {string} inputSelector - CSS selector for password input
 */
export function setupPasswordToggle(toggleSelector, inputSelector) {
    const toggleButton = document.querySelector(toggleSelector);
    const passwordField = document.querySelector(inputSelector);
    
    if (toggleButton && passwordField) {
        toggleButton.addEventListener('click', function() {
            // Toggle password visibility
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            
            // Toggle eye icon
            const eyeIcon = this.querySelector('i');
            eyeIcon.classList.toggle('fa-eye');
            eyeIcon.classList.toggle('fa-eye-slash');
        });
    }
}