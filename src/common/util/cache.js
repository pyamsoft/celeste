import { CacheMan, MemoryStorageBackend } from "@runmeetly/cache-man";

export function createCache(upstream, timeout) {
  return CacheMan.create(upstream, {
    backend: timeout ? MemoryStorageBackend.create(timeout) : null,
  });
}

class Debouncer {
  #cache;

  constructor(cache) {
    this.#cache = cache;
  }

  get(...args) {
    return this.#cache.get(...args).finally(() => this.clear());
  }

  clear() {
    this.#cache.clear();
  }
}

export function createDebouncer(upstream) {
  const cache = CacheMan.create(upstream);
  return new Debouncer(cache);
}
