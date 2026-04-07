/**
 * Image URL utilities for lightweight image optimization
 * Estimated bundle impact: ~0.3KB
 * 
 * Gracefully degrades if backend ignores query params.
 * No external dependencies.
 */

/**
 * Check if URL is valid string
 * @param {string} url
 * @returns {boolean}
 */
export function isValidUrl(url) {
  if (url === null || url === undefined) return false;
  if (typeof url !== 'string') return false;
  return url.trim().length > 0;
}

/**
 * Append query params to URL safely
 * Handles both URLs with/without existing params
 * @param {string} url
 * @param {string} params - e.g., "w=400&q=70"
 * @returns {string}
 */
function appendParams(url, params) {
  if (!isValidUrl(url)) return '';
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${params}`;
}

/**
 * Get thumbnail URL with small size optimization
 * For: card images, list views
 * @param {string} url
 * @returns {string} Original URL if invalid or params ignored = graceful degradation
 */
export function getThumbnailUrl(url) {
  if (!isValidUrl(url)) return '';
  return appendParams(url, 'w=400&q=70');
}

/**
 * Get hero banner URL optimized for large screens
 * For: hero sections, banners
 * @param {string} url
 * @returns {string}
 */
export function getHeroUrl(url) {
  if (!isValidUrl(url)) return '';
  return appendParams(url, 'w=1200&q=80');
}

/**
 * Get ultra-small LQIP (Low Quality Image Placeholder)
 * 20px tiny blur preview for shimmer effect
 * Backend can cache this aggressively (1 year TTL)
 * @param {string} url
 * @returns {string}
 */
export function getLQIP(url) {
  if (!isValidUrl(url)) return '';
  return appendParams(url, 'w=30&q=20');
}
