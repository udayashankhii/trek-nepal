export { trekService } from "./TrekService";
export { cacheManager } from "../../cache/CacheManager";
export { requestDeduplicator } from "../../cache/RequestDeduplicator";

// Legacy named exports for backward compatibility
export {
  trekService as default,
  trekService as TrekService
};
