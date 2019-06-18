const MemoryCache = require('@firstandthird/memory-cache');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class FunctionCache {
  constructor(allowStale) {
    this.cache = new MemoryCache();
    this.allowStale = allowStale;
  }

  // returns an instance of a memoizer:
  async memo(key, fn, ttl, forceUpdate) {
    const value = this.cache.getCacheObject(key);
    if (!forceUpdate && value) {
      // in allowStale mode we let it refresh while the current value is returned:
      if (this.allowStale) {
        // don't await this so it can resolve in the background
        // while we move on and return the current value:
        new Promise(async resolve => {
          const result = await fn();
          this.cache.set(key, result, ttl);
        });
      }
      return value.value;
    }
    const result = await fn();
    this.cache.set(key, result, ttl);
    return result;
  }
}
module.exports = FunctionCache;
