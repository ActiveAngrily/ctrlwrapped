const analyzeHistory = (data) => {
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
        hourEntries.sort(([, a], [, b]) => b - a);
        
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

    const googleSearches = data.filter(row => row.url && row.url.includes('google.com/search')).length;
    const searchMaster = {
        percentage: data.length > 0 ? ((googleSearches / data.length) * 100).toFixed(1) : '0.0'
    };

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

    const typingPro = data.filter(row => row.transition === 'typed').length;

    const tabReloader = data.filter(row => row.transition === 'reload').length;

    return { topSites, primeTime, searchMaster, rabbitHole, typingPro, tabReloader };
}


export default async (req, res) => {
    if (req.method === 'POST') {
        try {
            const historyData = req.body;
            const data = historyData['Browser History'] || historyData;

            if (Array.isArray(data) && data.length > 0) {
                const analysisResults = analyzeHistory(data);
                res.status(200).json(analysisResults);
            } else {
                res.status(400).json({ error: 'Could not find valid history data in the JSON file.' });
            }
        } catch (error) {
            console.error('Error processing history:', error);
            res.status(500).json({ error: 'The selected file is not a valid JSON file. Please check the file and try again.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};