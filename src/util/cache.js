import { CacheMan } from "@runmeetly/cache-man";

export function createCache(upstream, timeout) {
  return CacheMan.create(upstream, {
    timeout,
  });
}

class Debouncer {
  constructor(cache) {
    this.cache = cache;
  }

  get(...args) {
    return this.cache.get(...args).finally(() => this.clear());
  }

  clear() {
    this.cache.clear();
  }
}

export function createDebouncer(upstream) {
  const cache = CacheMan.create(upstream);
  return new Debouncer(cache);
}
