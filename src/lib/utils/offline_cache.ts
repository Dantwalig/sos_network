// src/lib/utils/offline-cache.ts

/**
 * Offline cache manager using LocalStorage
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // milliseconds
}

export class OfflineCache {
  private prefix = 'sos_cache_';
  
  /**
   * Store item in cache
   */
  set<T>(key: string, data: T, expiresIn: number = 3600000): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiresIn,
    };
    
    try {
      localStorage.setItem(
        this.prefix + key,
        JSON.stringify(item)
      );
    } catch (error) {
      console.error('Failed to cache data:', error);
    }
  }
  
  /**
   * Retrieve item from cache
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return null;
      
      const cached: CacheItem<T> = JSON.parse(item);
      
      // Check if expired
      if (Date.now() - cached.timestamp > cached.expiresIn) {
        this.remove(key);
        return null;
      }
      
      return cached.data;
    } catch (error) {
      console.error('Failed to retrieve cache:', error);
      return null;
    }
  }
  
  /**
   * Remove item from cache
   */
  remove(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }
  
  /**
   * Clear all cache
   */
  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }
  
  /**
   * Get all cached SOS requests
   */
  getAllSOS(): any[] {
    const keys = Object.keys(localStorage);
    const sosRequests: any[] = [];
    
    keys.forEach(key => {
      if (key.startsWith(this.prefix + 'sos_')) {
        const data = this.get(key.replace(this.prefix, ''));
        if (data) sosRequests.push(data);
      }
    });
    
    return sosRequests;
  }
}

export const offlineCache = new OfflineCache();