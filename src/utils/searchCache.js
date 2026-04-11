/**
 * searchCache - Simple in-memory search result caching for performance
 */

class SearchCache {
  constructor(maxSize = 50) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  /**
   * Generate cache key from search query and filters
   */
  generateKey(query, filters) {
    const filterStr = JSON.stringify(filters || {});
    return `${query}::${filterStr}`;
  }

  /**
   * Get cached results
   */
  get(query, filters) {
    const key = this.generateKey(query, filters);
    return this.cache.get(key);
  }

  /**
   * Set cache results
   */
  set(query, filters, results) {
    const key = this.generateKey(query, filters);
    
    // Simple LRU: remove oldest entry if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, results);
  }

  /**
   * Clear entire cache
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Clear cache for specific query
   */
  clearQuery(query) {
    for (const key of this.cache.keys()) {
      if (key.startsWith(`${query}::`)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache size
   */
  size() {
    return this.cache.size;
  }
}

export const searchCache = new SearchCache();
