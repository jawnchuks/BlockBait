
// Constants
const SIMILARITY_THRESHOLD = 0.9;
const URL_VALIDATION_PATTERN = /^(https?|http):\/\/[^\s/$.?#].[^\s]*$/i;

// Utility functions
const isValidUrl = (url) => {
    return URL_VALIDATION_PATTERN.test(url);
};

const extractDomain = (url) => {
    const domainRegex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/g;
    const matches = domainRegex.exec(url);
    if (matches && matches.length > 1) {
        return matches[1];
    }
    return null;
};

const calculateSimilarity = (url1, url2) => {
    const minLength = Math.min(url1.length, url2.length);
    let matchingChars = 0;

    for (let i = 0; i < minLength; i++) {
        if (url1[i] === url2[i]) {
            matchingChars++;
        }
    }

    return matchingChars / minLength;
};

const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

const checkBlacklist = async (url) => {
    const domain = extractDomain(url);
    const blacklistData = await loadBlacklistData();
    const whitelistData = await loadWhitelistData();

    if (whitelistData.includes(domain)) {
        return false; // Website is in the whitelist, don't block it
    }

    return blacklistData.includes(domain);
};

// const checkBlacklist = async (url) => {
//     const domain = extractDomain(url);
//     const blacklistData = await loadBlacklistData();
//     const whitelistData = await loadWhitelistData();

//     if (whitelistData.includes(domain)) {
//         return false; // Website is in the whitelist, don't block it
//     }

//     // Add an exception logic here to skip blocking for specific websites
//     const { exceptionWebsite } = await chrome.storage.sync.get('exceptionWebsite');
//     if (exceptionWebsite && extractDomain(url) === exceptionWebsite) {
//         return false; // Website is in the exception list, don't block it
//     }

//     return blacklistData.includes(domain);
// };


const checkWhitelist = async (url) => {
    const domain = extractDomain(url);
    const whitelistData = await loadWhitelistData();
    return whitelistData.includes(domain);
};

const loadBlacklistData = async () => {
    try {
        const response = await fetch(chrome.runtime.getURL('../static/blacklist.json'));
        const blacklistData = await response.json();
        return blacklistData;
    } catch (error) {
        console.error('Error loading blacklist data:', error);
        return [];
    }
};

const loadWhitelistData = async () => {
    try {
        const response = await fetch(chrome.runtime.getURL('../static/whitelist.json'));
        const whitelistData = await response.json();
        return whitelistData;
    } catch (error) {
        console.error('Error loading whitelist data:', error);
        return [];
    }
};

const performSimilarityCheck = async (url, dataList) => {
    for (const data of dataList) {
        const similarity = calculateSimilarity(url, data);
        if (similarity <= SIMILARITY_THRESHOLD) {
            return true; // Return the similar URL
        }
    }
    return false; // No similar URL found
};



const tabUrls = {}; // Keep track of URLs for each tab separately



const startPhishScanning = debounce(async (tab) => {
    const { phishingScanEnabled } = await chrome.storage.sync.get('phishingScanEnabled');
    if (!phishingScanEnabled) {
        return;
    }

    const tabId = tab.id;
    const currentUrl = tab?.url || '';

    // Save the URL for the current tab in the tabUrls object
    tabUrls[tabId] = currentUrl;

    if (!isValidUrl(currentUrl)) {
        console.log('Invalid URL', currentUrl);
        return;
    }

    // Check if the current URL is in the exception list
    const { exceptionList } = await chrome.storage.sync.get("exceptionList");
    console.log(exceptionList);

    if (!Array.isArray(exceptionList)) {
        // If exceptionList is not an array, initialize it as an empty array
        await chrome.storage.sync.set({ exceptionList: [] });
        return;
    }

    if (exceptionList.includes(currentUrl)) {
        console.log('URL in exception list, allowing access:', currentUrl);
        return;
    }

    const isInWhitelist = await checkWhitelist(currentUrl);
    const whitelistData = await loadWhitelistData();
    const whitelistSimilarUrl = await performSimilarityCheck(currentUrl, whitelistData);
    const isInBlacklist = await checkBlacklist(currentUrl);
    const blacklistData = await loadBlacklistData();
    const blacklistSimilarUrl = await performSimilarityCheck(currentUrl, blacklistData);

    switch (true) {
        case isInWhitelist:
            console.log('Exact match to whitelist:', currentUrl);
            await chrome.storage.sync.set({ scanStatus: 'secure' });
            await chrome.storage.sync.set({ urlStatus: currentUrl });
            break;

        case isInBlacklist:
            console.log('URL in blacklist:', currentUrl);
            await chrome.storage.sync.set({ scanStatus: 'unsafe' });
            await chrome.storage.sync.set({ urlStatus: currentUrl });
            await chrome.tabs.update(tab.id, { url: 'blocked.html' });
            chrome.notifications.create({
                type: "basic",
                iconUrl: "../icons/unsafe-icon.png",
                title: "Unsafe URL",
                message: "Do not enter this website, it's unsafe!",
            });
            break;

        default:
            if (whitelistSimilarUrl) {
                console.log('Similar URL to whitelist:', currentUrl);
                console.log('Similar whitelist URL:', whitelistSimilarUrl);
                await chrome.storage.sync.set({ scanStatus: 'malicious' });
                await chrome.storage.sync.set({ urlStatus: currentUrl });
                await chrome.tabs.update(tab.id, { url: 'typo.html' });
                chrome.notifications.create({
                    type: "basic",
                    iconUrl: "../icons/warning-icon.png",
                    title: "Typo",
                    message: "It seems you entered a wrong url",
                });
                break;
            }

            if (blacklistSimilarUrl) {
                console.log('Similar URL to blacklist:', currentUrl);
                console.log('Similar blacklist URL:', blacklistSimilarUrl);
                await chrome.storage.sync.set({ scanStatus: 'malicious' });
                await chrome.storage.sync.set({ urlStatus: currentUrl });
                await chrome.tabs.update(tab.id, { url: 'warning.html' });
                chrome.notifications.create({
                    type: "basic",
                    iconUrl: "../icons/warning-icon.png",
                    title: "Malicious URL",
                    message: "This website is flagged as malicious!",
                });
                break;
            }

            console.log('URL not in whitelist/blacklist, showing warning:', currentUrl);
            await chrome.storage.sync.set({ scanStatus: 'malicious' });
            await chrome.storage.sync.set({ urlStatus: currentUrl });
            await chrome.tabs.update(tab.id, { url: 'warning.html' });
            chrome.notifications.create({
                type: "basic",
                iconUrl: "../icons/warning-icon.png",
                title: "Malicious URL",
                message: "This website is flagged as malicious!",
            });
    }

}, 500);



// const shouldSkipBlocking = async (url) => {
//     const { trustWebsite } = await chrome.storage.sync.get('trustWebsite');
//     return trustWebsite && extractDomain(url) === trustWebsite;
// };

// Event listener for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        startPhishScanning(tab);
    }
});

// Initial scan when the extension is installed or enabled
chrome.runtime.onInstalled.addListener(() => {
    console.log('Welcome to BlockBait');
});

