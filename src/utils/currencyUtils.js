/**
 * Currency Conversion Utilities
 * Converts USD to INR at a rate of 1 USD = 83 INR
 */

const USD_TO_INR_RATE = 83;

/**
 * Convert USD amount to INR
 * @param {number} usdAmount - Price in USD
 * @returns {number} Price in INR
 */
export const convertToINR = (usdAmount) => {
    if (!usdAmount || isNaN(usdAmount)) return 0;
    return Math.round(usdAmount * USD_TO_INR_RATE);
};

/**
 * Format price in INR with currency symbol
 * @param {number} amount - Amount in INR
 * @returns {string} Formatted price string
 */
export const formatINRPrice = (amount) => {
    if (!amount || isNaN(amount)) return '₹0';
    return `₹${amount.toLocaleString('en-IN')}`;
};

/**
 * Convert USD to INR and format
 * @param {number} usdAmount - Price in USD
 * @returns {string} Formatted INR price
 */
export const convertAndFormatINR = (usdAmount) => {
    const inrAmount = convertToINR(usdAmount);
    return formatINRPrice(inrAmount);
};

/**
 * Extract numeric value from price string
 * @param {string|number} price - Price string or number
 * @returns {number} Numeric price value
 */
export const extractPrice = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
        const matches = price.match(/[\d.]+/);
        return matches ? parseFloat(matches[0]) : 0;
    }
    return 0;
};
