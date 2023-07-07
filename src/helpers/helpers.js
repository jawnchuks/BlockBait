/*global chrome*/
const SIMILARITY_THRESHOLD = 0.9;
const URL_VALIDATION_PATTERN = /^(https?|http):\/\/[^\s/$.?#].[^\s]*$/i;

export const isValidUrl = (url) => {
    return URL_VALIDATION_PATTERN.test(url);
};

export const extractDomain = (url) => {
    const parser = document.createElement("a");
    parser.href = url;
    return parser.hostname;
};

export const calculateSimilarity = (url1, url2) => {
    const domain1 = extractDomain(url1);
    const domain2 = extractDomain(url2);

    const similarity = stringSimilarity.compareTwoStrings(domain1, domain2);
    return similarity;
};

export const checkBlacklist = async (url) => {
    const { blacklist } = await chrome.storage.sync.get("blacklist");
    const domain = extractDomain(url);
    return blacklist.includes(domain);
};

export const checkWhitelist = async (url) => {
    const { whitelist } = await chrome.storage.sync.get("whitelist");
    const domain = extractDomain(url);
    return whitelist.includes(domain);
};

export const performSimilarityCheck = async (url) => {
    const { history } = await chrome.storage.sync.get("history");
    const isSimilar = history.some((visitedUrl) => {
        const similarity = calculateSimilarity(url, visitedUrl);
        return similarity >= SIMILARITY_THRESHOLD;
    });
    return isSimilar;
};
