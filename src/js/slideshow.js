document.addEventListener('DOMContentLoaded', () => {
    // Retrieve the analysis results from session storage
    const results = JSON.parse(sessionStorage.getItem('analysisResults'));

    // Check if results exist
    if (!results) {
        // If no results, display an error and offer to go back
        const grid = document.getElementById('insights-grid');
        grid.innerHTML = `
            <div class="insight-card" style="grid-column: 1 / -1;">
                <h3>Oops!</h3>
                <p class="description">No analysis data found. Please go back and upload your history file.</p>
            </div>
        `;
        return;
    }

    // Display the insights
    displayInsights(results);
});

/**
 * Renders the analysis results into the DOM.
 * @param {object} results - The analysis results object.
 */
function displayInsights(results) {
    const grid = document.getElementById('insights-grid');
    grid.innerHTML = ''; // Clear any existing content

    // 1. Top 5 Visited Sites
    const topSitesCard = createInsightCard(
        'Top 5 Sites',
        `<ul>${results.topSites.map(site => `<li>${site.url} (${site.visits} visits)</li>`).join('')}</ul>`,
        'Your most frequent digital hangouts.'
    );
    grid.appendChild(topSitesCard);

    // 2. Prime Time
    const primeTimeCard = createInsightCard(
        'Prime Time',
        `<div class="value">${results.primeTime.hour}</div>`,
        `You were most active at this time. ${results.primeTime.award}!`
    );
    grid.appendChild(primeTimeCard);
    
    // 3. Search Master
    const searchMasterCard = createInsightCard(
        'Search Master',
        `<div class="value">${results.searchMaster.percentage}%</div>`,
        'Of your browsing started with a Google search.'
    );
    grid.appendChild(searchMasterCard);

    // 4. Rabbit Hole
    const rabbitHoleCard = createInsightCard(
        'Deepest Rabbit Hole',
        `<div class="value">${results.rabbitHole.url}</div>`,
        `You visited this site ${results.rabbitHole.count} times in a row.`
    );
    grid.appendChild(rabbitHoleCard);

    // 5. Typing Pro
    const typingProCard = createInsightCard(
        'Typing Pro',
        `<div class="value">${results.typingPro}</div>`,
        'Times you knew exactly where you wanted to go.'
    );
    grid.appendChild(typingProCard);

    // 6. Tab Reloader
    const tabReloaderCard = createInsightCard(
        'Tab Reloader',
        `<div class="value">${results.tabReloader}</div>`,
        'Times you refreshed a page, hoping for new content.'
    );
    grid.appendChild(tabReloaderCard);
}

/**
 * Helper function to create an insight card element.
 * @param {string} title - The title of the insight.
 * @param {string} valueHTML - The HTML content for the main value.
 * @param {string} description - The description text.
 * @returns {HTMLElement} - The created card element.
 */
function createInsightCard(title, valueHTML, description) {
    const card = document.createElement('div');
    card.className = 'insight-card';
    card.innerHTML = `
        <h3>${title}</h3>
        ${valueHTML}
        <p class="description">${description}</p>
    `;
    return card;
}
