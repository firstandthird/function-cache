const MemoryCache = require('@firstandthird/memory-cache');

class FunctionCache {
  constructor(fastMode = false) {
    this.cache = new MemoryCache();
    this.fastMode = fastMode;
  }

  async memo(key, fn, ttl, forceUpdate) {
    const value = this.cache.getCacheObject(key);
    if (!forceUpdate && value) {
      // in fastMode we refresh expired values in the
      // background while the current value is returned:
      if ((value.expires > 0 && value.expires < new Date().getTime())) {
        if (this.fastMode) {
          new Promise(async resolve => {
            const result = await fn();
            this.cache.set(key, result, ttl);
          });
          return value.value;
        }
      } else {
        return value.value;
      }
    }
    const result = await fn();
    this.cache.set(key, result, ttl);
    return result;
  }
}
module.exports = FunctionCache;
