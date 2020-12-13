const inMemoryCache = {};

const CacheKey = {
  PRODUCTS: 'products',
};

class CacheService {
  constructor({ exp = 120000 }) {
    this.exp = exp;
  }

  get(key) {
    if (inMemoryCache[key]) {
      return inMemoryCache[key].value;
    }
    return null;
  }

  set(key, value) {
    if (!inMemoryCache[key]) {
      let exp = null;
      if (this.exp && this.exp > 0) {
        console.log('exp', exp);
        exp = setTimeout(() => {
          this.invalidate(key);
        }, this.exp);
      }
      inMemoryCache[key] = {
        value,
        exp,
      };
    }
  }

  invalidate(key) {
    if (inMemoryCache[key]) {
      if (inMemoryCache[key].exp) {
        clearTimeout(inMemoryCache[key].exp);
      }
      delete inMemoryCache[key];
    }
  }
}

module.exports = {
  CacheService,
  CacheKey,
};
