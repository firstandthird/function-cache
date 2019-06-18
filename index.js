const MemoryCache = require('@firstandthird/memory-cache');

class FunctionCache {
  constructor(allowStale) {
    this.cache = new MemoryCache();
    this.allowStale = allowStale;
  }

  async memo(key, fn, ttl, forceUpdate) {
    const value = this.cache.getCacheObject(key);
    if (!forceUpdate && value) {
      // in allowStale mode we let it refresh while the current value is returned:
      if (this.allowStale) {
        // resolve in the background while we move on and return the current value:
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
