/**
 * Pre-computed route cache system
 * Run this script to generate routes, then import them
 */

export class RouteCache {
  constructor() {
    this.cache = new Map();
  }

  // Generate cache key
  getCacheKey(lat1, lng1, lat2, lng2) {
    return `${lat1.toFixed(4)},${lng1.toFixed(4)}-${lat2.toFixed(4)},${lng2.toFixed(4)}`;
  }

  // Store route
  set(fromPoint, toPoint, routeData) {
    const key = this.getCacheKey(
      fromPoint.lat,
      fromPoint.lng,
      toPoint.lat,
      toPoint.lng
    );
    this.cache.set(key, {
      ...routeData,
      cachedAt: Date.now(),
    });
  }

  // Retrieve route
  get(fromPoint, toPoint) {
    const key = this.getCacheKey(
      fromPoint.lat,
      fromPoint.lng,
      toPoint.lat,
      toPoint.lng
    );
    return this.cache.get(key);
  }

  // Export to JSON
  export() {
    return JSON.stringify(Array.from(this.cache.entries()));
  }

  // Import from JSON
  import(jsonData) {
    const entries = JSON.parse(jsonData);
    this.cache = new Map(entries);
  }
}