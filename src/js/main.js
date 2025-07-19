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

// --- AUTH AND UI FUNCTIONS (No changes here, keeping them as they are) ---

async function checkAuthStatus() {
    try {
        const user = await authService.getCurrentUser();
        if (user) {
            updateUIForLoggedInUser(user);
            return user;
        } else {
            updateUIForLoggedOutUser();
            return null;
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
        updateUIForLoggedOutUser();
        return null;
    }
}

function updateUIForLoggedInUser(user) {
    const loginButton = document.querySelector('.login-button');
    if (loginButton) {
        loginButton.textContent = user.name;
        loginButton.classList.add('logged-in');
        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown';
        const dropdownContent = document.createElement('div');
        dropdownContent.className = 'dropdown-content';
        const logoutLink = document.createElement('a');
        logoutLink.href = '#';
        logoutLink.textContent = 'Logout';
        logoutLink.addEventListener('click', handleLogout);
        dropdownContent.appendChild(logoutLink);
        const parent = loginButton.parentNode;
        parent.insertBefore(dropdown, loginButton);
        dropdown.appendChild(loginButton);
        dropdown.appendChild(dropdownContent);
        loginButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            dropdownContent.classList.toggle('show');
        });
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                dropdownContent.classList.remove('show');
            }
        });
    }
}

function updateUIForLoggedOutUser() {
    const loginButton = document.querySelector('.login-button');
    if (loginButton) {
        loginButton.textContent = 'login';
        loginButton.classList.remove('logged-in');
    }
}

function setupNavigation(user) {
    const loginButton = document.querySelector('.login-button');
    if (loginButton && !user) {
        loginButton.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }
    const instructionsButton = document.querySelector('.instructions-button');
    if (instructionsButton) {
        instructionsButton.addEventListener('click', function() {
            alert('Instructions page coming soon!');
        });
    }
    const disclaimerButton = document.querySelector('.disclaimer-button');
    if (disclaimerButton) {
        disclaimerButton.addEventListener('click', function() {
            window.location.href = 'disclaimer.html';
        });
    }
}

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

// --- NEW FILE PROCESSING AND ANALYSIS LOGIC ---

function setupUploadButton() {
    const uploadBtn = document.querySelector('.upload-btn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            authService.isLoggedIn().then(isLoggedIn => {
                if (!isLoggedIn) {
                    window.location.href = 'login.html';
                    return;
                }
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                // We are now only accepting JSON files
                fileInput.accept = '.json'; 
                fileInput.style.display = 'none';
                document.body.appendChild(fileInput);
                fileInput.click();
                fileInput.addEventListener('change', function() {
                    if (this.files && this.files.length > 0) {
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
 * Process the uploaded JSON file.
 * @param {File} file - The uploaded file.
 */
function processFile(file) {
    const reader = new FileReader();

    reader.onload = function(event) {
        try {
            const historyData = JSON.parse(event.target.result);
            // The JSON from Google Takeout is usually in a top-level key
            const data = historyData['Browser History'] || historyData;

            if (Array.isArray(data) && data.length > 0) {
                // Perform the analysis
                const analysisResults = analyzeHistory(data);

                // Store results in session storage to pass to the next page
                sessionStorage.setItem('analysisResults', JSON.stringify(analysisResults));

                // Redirect to the slideshow page
                window.location.href = 'slideshow.html';
            } else {
                alert('Could not find valid history data in the JSON file.');
            }
        } catch (error) {
            console.error('Error parsing JSON file:', error);
            alert('The selected file is not a valid JSON file. Please check the file and try again.');
        }
    };

    reader.readAsText(file);
}

/**
 * Analyzes the parsed history data to generate insights.
 * @param {Array<Object>} data - The history data.
 * @returns {Object} - An object containing all the calculated insights.
 */
function analyzeHistory(data) {
    // Return a default structure if there's no data to analyze
    if (!data || data.length === 0) {
        return {
            topSites: [],
            primeTime: { hour: 'N/A', award: 'Ghost' },
            searchMaster: { percentage: '0.0' },
            rabbitHole: { url: 'N/A', count: 0 },
            typingPro: 0,
            tabReloader: 0
        };
    }

    // 1. Top 5 Visited Sites
    const urlCounts = data.reduce((acc, row) => {
        try {
            if (row.url && row.url.startsWith('http')) {
                const hostname = new URL(row.url).hostname.replace('www.', '');
                acc[hostname] = (acc[hostname] || 0) + 1;
            }
        } catch (e) { /* Ignore invalid URLs */ }
        return acc;
    }, {});
    const topSites = Object.entries(urlCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([url, visits]) => ({ url, visits }));

    // 2. Prime Time (Busiest Hour) - ROBUST FIX
    const hourCounts = data.reduce((acc, row) => {
        if (row.time_usec && !isNaN(row.time_usec)) {
            const hour = new Date(row.time_usec / 1000).getHours();
            acc[hour] = (acc[hour] || 0) + 1;
        }
        return acc;
    }, {});

    let primeTime = { hour: 'N/A', award: 'Time Traveler' };
    const hourEntries = Object.entries(hourCounts);

    if (hourEntries.length > 0) {
        // Sort by count (the second element in each entry) in descending order
        hourEntries.sort(([, a], [, b]) => b - a);
        
        // The busiest hour is the key (as a string) of the first element
        const busiestHourStr = hourEntries[0][0]; 
        const busiestHourNum = parseInt(busiestHourStr, 10);
        
        let primeTimeAward = "Productivity Peak";
        if (busiestHourNum >= 22 || busiestHourNum < 4) primeTimeAward = "Night Owl";
        if (busiestHourNum >= 5 && busiestHourNum < 9) primeTimeAward = "Early Bird";
        
        primeTime = {
            hour: `${busiestHourStr}:00 - ${busiestHourNum + 1}:00`,
            award: primeTimeAward
        };
    }

    // 3. Search Master
    const googleSearches = data.filter(row => row.url && row.url.includes('google.com/search')).length;
    const searchMaster = {
        percentage: data.length > 0 ? ((googleSearches / data.length) * 100).toFixed(1) : '0.0'
    };

    // 4. Rabbit Hole
    let maxConsecutiveVisits = 0;
    let currentConsecutiveVisits = 0;
    let rabbitHoleUrl = 'N/A';
    let currentRabbitHoleUrl = 'N/A';

    for (let i = 0; i < data.length; i++) {
        let currentUrl = null;
        try {
            if (data[i].url) {
                currentUrl = new URL(data[i].url).hostname.replace('www.', '');
            }
        } catch(e) { continue; }

        if (currentUrl === currentRabbitHoleUrl) {
            currentConsecutiveVisits++;
        } else {
            currentRabbitHoleUrl = currentUrl;
            currentConsecutiveVisits = 1;
        }

        if (currentConsecutiveVisits > maxConsecutiveVisits) {
            maxConsecutiveVisits = currentConsecutiveVisits;
            rabbitHoleUrl = currentRabbitHoleUrl;
        }
    }
    const rabbitHole = { url: rabbitHoleUrl, count: maxConsecutiveVisits };

    // 5. Typing Pro
    const typingPro = data.filter(row => row.transition === 'typed').length;

    // 6. Tab Reloader
    const tabReloader = data.filter(row => row.transition === 'reload').length;

    return { topSites, primeTime, searchMaster, rabbitHole, typingPro, tabReloader };
}


// --- ADJUST HEIGHTS FUNCTION (No changes here) ---

function adjustHeights() {
    const container = document.querySelector('.container');
    const header = document.querySelector('.header');
    const content = document.querySelector('.content');
    const footer = document.querySelector('.footer');
    
    if (header && content && footer) {
        const availableHeight = container.offsetHeight - header.offsetHeight - footer.offsetHeight;
        content.style.height = `${availableHeight}px`;
        
        const featuredImg = document.querySelector('.featured-img');
        if (featuredImg) {
            const maxImgHeight = content.offsetHeight * 0.85;
            featuredImg.style.maxHeight = `${maxImgHeight}px`;
        }
        
        const uploadBtn = document.querySelector('.upload-btn');
        if (uploadBtn) {
            const contentHeight = content.offsetHeight;
            const buttonHeight = Math.min(Math.max(contentHeight * 0.12, 80), 120);
            uploadBtn.style.height = `${buttonHeight}px`;
        }
    }
}