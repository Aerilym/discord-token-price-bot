export enum CACHE_KEY {
  NETWORK_API_RESPONSE = 0,
  PRICE_DATA = 1,
  OPEN_NODES = 2,
}

export class Cache {
  items: Map<CACHE_KEY, unknown> = new Map();
  times: Map<CACHE_KEY, number> = new Map();

  /**
   * Get an item out of the cache if its not expired
   * @param key - Cache key
   *
   * @returns the cached item if it is not expired otherwise null
   */
  public get<T>(key: CACHE_KEY): T | null {
    const expireTime = this.times.get(key);

    if (!expireTime) return null;

    if (expireTime > Date.now()) {
      this.times.delete(key);
      this.items.delete(key);
      return null;
    }

    return (this.items.get(key) as T) ?? null;
  }

  /**
   * Set a cache item with a ttl and return the expiry time.
   * @param key - Cache key
   * @param value - Value to store
   * @param ttl - Time to live in milliseconds
   *
   * @return the expire time.
   */
  public set(key: CACHE_KEY, value: unknown, ttl: number) {
    if (ttl < 0) throw new Error('Positive ttl is required!');

    const expireTime = Date.now() + ttl;

    this.times.set(key, expireTime);
    this.items.set(key, value);

    return expireTime;
  }

  /**
   * Set a cache item with an expire time and return the expire time.
   * @param key - Cache key
   * @param value - Value to store
   * @param expireTime - Time in milliseconds the cache item expires.
   *
   * @return the expire time.
   */
  public setWithExpireTime(key: CACHE_KEY, value: unknown, expireTime: number) {
    this.times.set(key, expireTime);
    this.items.set(key, value);
    return expireTime;
  }
}

export const cache = new Cache();
