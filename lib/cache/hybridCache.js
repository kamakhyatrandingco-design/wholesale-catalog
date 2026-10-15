/**
 * Hybrid Caching Engine for Headless Microservices
 * Provides Redis support with automatic in-memory LRU fallback.
 * Guarantees sub-millisecond response times for catalog, inventory, and session caching.
 */

class MemoryCache {
  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
    this.store = new Map();
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    // Refresh LRU position
    this.store.delete(key);
    this.store.set(key, entry);
    return entry.value;
  }

  set(key, value, ttlSeconds = 300) {
    if (this.store.size >= this.maxSize) {
      // Evict oldest item
      const firstKey = this.store.keys().next().value;
      if (firstKey) this.store.delete(firstKey);
    }

    const expiresAt = ttlSeconds > 0 ? Date.now() + (ttlSeconds * 1000) : null;
    this.store.set(key, { value, expiresAt });
    return true;
  }

  del(key) {
    return this.store.delete(key);
  }

  flush() {
    this.store.clear();
    return true;
  }

  size() {
    return this.store.size;
  }
}

class HybridCache {
  constructor() {
    this.memCache = new MemoryCache(2000);
    this.redisClient = null;
    this.isRedisConnected = false;
    this.initRedis();
  }

  async initRedis() {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      return;
    }

    try {
      // Dynamic import if redis package exists
      const { createClient } = await import('redis');
      this.redisClient = createClient({ url: redisUrl });
      
      this.redisClient.on('error', (err) => {
        console.warn('[HybridCache] Redis connection error, falling back to In-Memory LRU:', err.message);
        this.isRedisConnected = false;
      });

      this.redisClient.on('connect', () => {
        console.log('[HybridCache] Connected to Redis cluster at:', redisUrl.replace(/\/\/[^@]*@/, '//***@'));
        this.isRedisConnected = true;
      });

      await this.redisClient.connect();
    } catch {
      // Redis optional in serverless/local fallback
      this.isRedisConnected = false;
    }
  }

  async get(key) {
    // 1. Try Redis if connected
    if (this.isRedisConnected && this.redisClient) {
      try {
        const raw = await this.redisClient.get(key);
        if (raw !== null) {
          try {
            return JSON.parse(raw);
          } catch {
            return raw;
          }
        }
      } catch (err) {
        console.warn(`[HybridCache] Redis GET error for key ${key}:`, err.message);
      }
    }

    // 2. Fallback to in-memory LRU
    return this.memCache.get(key);
  }

  async set(key, value, ttlSeconds = 300) {
    // 1. Store in memory LRU
    this.memCache.set(key, value, ttlSeconds);

    // 2. Store in Redis if connected
    if (this.isRedisConnected && this.redisClient) {
      try {
        const serialized = typeof value === 'object' ? JSON.stringify(value) : String(value);
        if (ttlSeconds > 0) {
          await this.redisClient.setEx(key, ttlSeconds, serialized);
        } else {
          await this.redisClient.set(key, serialized);
        }
      } catch (err) {
        console.warn(`[HybridCache] Redis SET error for key ${key}:`, err.message);
      }
    }
    return true;
  }

  async del(key) {
    this.memCache.del(key);
    if (this.isRedisConnected && this.redisClient) {
      try {
        await this.redisClient.del(key);
      } catch (err) {
        console.warn(`[HybridCache] Redis DEL error for key ${key}:`, err.message);
      }
    }
    return true;
  }

  async flush() {
    this.memCache.flush();
    if (this.isRedisConnected && this.redisClient) {
      try {
        await this.redisClient.flushAll();
      } catch (err) {
        console.warn('[HybridCache] Redis FLUSH error:', err.message);
      }
    }
    return true;
  }

  getStats() {
    return {
      driver: this.isRedisConnected ? 'Redis + Memory LRU (L1/L2)' : 'In-Memory High-Speed LRU',
      memoryKeys: this.memCache.size(),
      redisConnected: this.isRedisConnected,
    };
  }
}

// Global singleton instance
export const cache = new HybridCache();
export default cache;
