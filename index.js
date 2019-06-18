const MemoryCache = require('@firstandthird/memory-cache');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// returns an instance of a memoizer:
module.exports = (allowStale) => {
  const cache = new MemoryCache();
  return async function(key, fn, ttl, forceUpdate) {
    const value = cache.get(key, allowStale);
    if (!forceUpdate && value) {
      // in allowStale mode we let it refresh while the current value is returned:
      if (allowStale) {
        // don't await this so it can resolve in the background
        // while we move on and return the current value:
        new Promise(async resolve => {
          const result = await fn();
          cache.set(key, result, ttl);
        });
      }
      return value;
    }
    const result = await fn();
    cache.set(key, result, ttl);
    return result;
  };
};
