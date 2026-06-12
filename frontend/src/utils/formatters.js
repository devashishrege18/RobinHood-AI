/**
 * Utility formatters for currency, text, and dates.
 */

/**
 * Format a number as currency (INR by default).
 */
export function formatCurrency(amount, currency = 'INR', locale = 'en-IN') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Truncate text to a max length with ellipsis.
 */
export function truncate(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '…';
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format user_type for display.
 */
export function formatUserType(type) {
  const labels = {
    farmer: '🌾 Farmer',
    retailer: '🏪 Retailer',
    small_business: '💼 Small Business',
  };
  return labels[type] || capitalize(type);
}

/**
 * Format confidence level with color class.
 */
export function getConfidenceColor(confidence) {
  const colors = {
    high: 'text-hood-400',
    medium: 'text-gold-400',
    low: 'text-red-400',
  };
  return colors[confidence] || 'text-night-400';
}

/**
 * Format a timestamp to a readable time string.
 */
export function formatTime(date = new Date()) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
