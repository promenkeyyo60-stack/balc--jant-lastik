interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class SimpleCache {
  private store = new Map<string, CacheEntry<unknown>>();

  set<T>(key: string, data: T, ttlMs: number): void {
    this.store.set(key, { data, expiresAt: Date.now() + ttlMs });
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.data as T;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  size(): number {
    return this.store.size;
  }
}

export const cache = new SimpleCache();

export const TTL = {
  SQUAD: 6 * 60 * 60 * 1000,   // 6 saat — kadro nadiren değişir
  TEAMS: 24 * 60 * 60 * 1000,  // 24 saat — lig takımları listesi
  SEARCH: 60 * 60 * 1000,       // 1 saat — arama sonuçları
};
