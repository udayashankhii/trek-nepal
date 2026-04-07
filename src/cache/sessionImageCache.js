/**
 * Session-scoped image cache
 * Lightweight: ~0.2KB
 * 
 * Prevents same image flickering if rendered twice
 * In-memory Map only (no IndexedDB, localStorage)
 * Auto-clears if exceeds 100 entries to prevent memory leaks on long sessions
 */

const imageCache = new Map();
const MAX_CACHE_SIZE = 100;

/**
 * Mark image URL as loaded
 * @param {string} url
 */
export function markLoaded(url) {
  if (!url) return;
  imageCache.set(url, true);
  
  // Auto-cleanup if cache exceeds max size
  if (imageCache.size > MAX_CACHE_SIZE) {
    // Remove oldest entry (FIFO simple cleanup)
    const firstKey = imageCache.keys().next().value;
    if (firstKey) imageCache.delete(firstKey);
  }
}

/**
 * Check if image URL has been loaded before
 * @param {string} url
 * @returns {boolean}
 */
export function isLoaded(url) {
  return url ? imageCache.has(url) : false;
}

/**
 * Clear entire cache (useful for navigation/cleanup)
 */
export function clearCache() {
  imageCache.clear();
}

export default { markLoaded, isLoaded, clearCache };
