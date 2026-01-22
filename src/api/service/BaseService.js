import axiosInstance from "../axiosInstance";
import { cacheManager } from "../../cache/CacheManager";
import { requestDeduplicator } from "../../cache/RequestDeduplicator";

/**
 * Base service class with built-in caching and deduplication
 * All specific services extend this class
 */
export class BaseService {
  constructor(basePath = "") {
    this.basePath = basePath;
  }

  /**
   * Generic GET request with caching
   */
  async get(endpoint, params = {}, options = {}) {
    const {
      useCache = true,
      cacheTTL = 5 * 60 * 1000,
      transform = (data) => data
    } = options;

    const fullPath = `${this.basePath}${endpoint}`;
    const cacheKey = cacheManager.generateKey(fullPath, params);

    // Check cache first
    if (useCache) {
      const cached = cacheManager.get(cacheKey);
      if (cached) return cached;
    }

    // Execute with deduplication
    return requestDeduplicator.execute(cacheKey, async () => {
      try {
        const response = await axiosInstance.get(fullPath, { params });
        const transformed = transform(response.data);
        
        if (useCache) {
          cacheManager.set(cacheKey, transformed, cacheTTL);
        }
        
        return transformed;
      } catch (error) {
        console.error(`API Error [GET ${fullPath}]:`, error.message);
        throw error;
      }
    });
  }

  /**
   * Generic POST request (no caching)
   */
  async post(endpoint, data = {}, config = {}) {
    const fullPath = `${this.basePath}${endpoint}`;
    
    try {
      const response = await axiosInstance.post(fullPath, data, config);
      return response.data;
    } catch (error) {
      console.error(`API Error [POST ${fullPath}]:`, error.message);
      throw error;
    }
  }

  /**
   * Generic PUT request (invalidates cache)
   */
  async put(endpoint, data = {}, config = {}) {
    const fullPath = `${this.basePath}${endpoint}`;
    
    try {
      const response = await axiosInstance.put(fullPath, data, config);
      this.invalidateCache(endpoint);
      return response.data;
    } catch (error) {
      console.error(`API Error [PUT ${fullPath}]:`, error.message);
      throw error;
    }
  }

  /**
   * Generic DELETE request (invalidates cache)
   */
  async delete(endpoint, config = {}) {
    const fullPath = `${this.basePath}${endpoint}`;
    
    try {
      const response = await axiosInstance.delete(fullPath, config);
      this.invalidateCache(endpoint);
      return response.data;
    } catch (error) {
      console.error(`API Error [DELETE ${fullPath}]:`, error.message);
      throw error;
    }
  }

  /**
   * Invalidate cache for specific endpoint pattern
   */
  invalidateCache(pattern) {
    cacheManager.clearPattern(pattern);
  }

  /**
   * Handle response transformation
   */
  normalizeArray(data, key = null) {
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') {
      if (key && Array.isArray(data[key])) return data[key];
      if (Array.isArray(data.results)) return data.results;
      if (Array.isArray(data.data)) return data.data;
    }
    return [];
  }

  /**
   * Batch requests with Promise.allSettled
   */
  async batchRequests(requests) {
    const results = await Promise.allSettled(requests);
    
    return results.map((result, index) => ({
      success: result.status === 'fulfilled',
      data: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason : null
    }));
  }
}
