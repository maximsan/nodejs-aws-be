const inMemoryCache = {};

const CacheKey = {
  PRODUCTS: 'products',
};

class CacheService {
  constructor({ exp = 120 }) {
    this.exp = exp;
  }

  get(key) {
    if (inMemoryCache[key]) {
      return inMemoryCache[key];
    }
    return null;
  }

  set(key, value) {
    if (!inMemoryCache[key]) {
      inMemoryCache[key] = value;
      this.cacheId = setTimeout(() => this.invalidate(key), this.exp);
    }
  }

  invalidate(key) {
    inMemoryCache[key] = null;
    clearTimeout(this.cacheId);
  }
}

module.exports = {
  CacheService,
  CacheKey,
};
