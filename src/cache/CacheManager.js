/**
 * Centralized cache management with TTL support
 * Implements memory-based caching with automatic expiration
 */
class CacheManager {
  constructor(options = {}) {
    this.cache = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes
    this.maxEntries = options.maxEntries || 200;
    this.persistKey = options.persistKey || "etn.cache.v1";
    this.persistEnabled = options.persistEnabled ?? (import.meta.env.VITE_CACHE_PERSIST === "true");

    if (this.persistEnabled) {
      this.loadFromStorage();
    }
  }

  /**
   * Generate cache key from endpoint and params
   */
  generateKey(endpoint, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {});
    return `${endpoint}::${JSON.stringify(sortedParams)}`;
  }

  /**
   * Get item from cache if valid
   */
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  /**
   * Set item in cache with TTL
   */
  set(key, data, ttl = this.defaultTTL) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl
    });

    this.pruneIfNeeded();
    this.persistToStorage();
  }

  /**
   * Check if key exists and is valid
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Clear entire cache
   */
  clear() {
    this.cache.clear();
    this.persistToStorage();
  }

  /**
   * Clear cache entries matching pattern
   */
  clearPattern(pattern) {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
    this.persistToStorage();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      maxEntries: this.maxEntries,
      persistEnabled: this.persistEnabled,
      entries: Array.from(this.cache.keys())
    };
  }

  pruneIfNeeded() {
    if (this.cache.size <= this.maxEntries) return;

    const sorted = Array.from(this.cache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);

    const overflow = this.cache.size - this.maxEntries;
    for (let i = 0; i < overflow; i += 1) {
      this.cache.delete(sorted[i][0]);
    }
  }

  loadFromStorage() {
    try {
      const raw = localStorage.getItem(this.persistKey);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return;

      const now = Date.now();
      Object.entries(parsed).forEach(([key, value]) => {
        if (!value || typeof value !== "object") return;
        if (value.expiresAt && value.expiresAt > now) {
          this.cache.set(key, value);
        }
      });

      this.pruneIfNeeded();
    } catch (error) {
      console.warn("CacheManager: failed to load persisted cache", error);
    }
  }

  persistToStorage() {
    if (!this.persistEnabled) return;

    try {
      const serializable = {};
      const now = Date.now();

      this.cache.forEach((value, key) => {
        if (value?.expiresAt && value.expiresAt > now) {
          serializable[key] = value;
        }
      });

      localStorage.setItem(this.persistKey, JSON.stringify(serializable));
    } catch (error) {
      console.warn("CacheManager: failed to persist cache", error);
    }
  }
}

export const cacheManager = new CacheManager();
