/**
 * Prevents duplicate concurrent requests
 * Returns same promise for identical in-flight requests
 */
class RequestDeduplicator {
  constructor() {
    this.pendingRequests = new Map();
  }

  /**
   * Execute request with deduplication
   */
  async execute(key, requestFn) {
    // Return existing promise if request is in-flight
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }

    // Create new request promise
    const promise = requestFn()
      .finally(() => {
        this.pendingRequests.delete(key);
      });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  /**
   * Check if request is pending
   */
  isPending(key) {
    return this.pendingRequests.has(key);
  }

  /**
   * Clear all pending requests
   */
  clear() {
    this.pendingRequests.clear();
  }
}

export const requestDeduplicator = new RequestDeduplicator();
