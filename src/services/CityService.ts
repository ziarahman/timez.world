import { getAvailableTimezones } from '../data/timezones';
import { Timezone } from '../types';

interface DynamicCityData {
  id: string;
  city: string;
  country: string;
  name: string;
  offset: number;
  population: number;
  timezone: string;
  latitude?: number;
  longitude?: number;
  lastUpdated?: number;
}

export class CityService {
  protected staticCities: Map<string, Timezone> = new Map();
  protected dynamicCities: Map<string, DynamicCityData> = new Map();
  protected cityCache: Map<string, Timezone> = new Map();
  protected searchCache: Map<string, Timezone[]> = new Map();
  protected cacheAccessTimes: Map<string, number> = new Map(); // Track access times
  protected lastSyncTime: number = 0;
  protected syncInterval: NodeJS.Timeout | null = null;
  protected staticCitiesLoaded: boolean = false;
  protected maxCacheSize: number = 10; // Default max cache size

  constructor() {
    // Initialize static cities
    this.initializeStaticCities();
  }

  protected startPeriodicSync(): void {
    // No-op since we're using static city data
  }

  protected async syncDynamicCities(): Promise<void> {
    // No-op since we're using static city data
    return Promise.resolve();
  }

  public addStaticCity(city: Timezone): void {
    // Add city to static cities
    this.staticCities.set(city.id, city);
    // Clear cache
    this.searchCache.clear();
    this.cacheAccessTimes.clear();
  }

  public addDynamicCity(city: Timezone): void {
    const dynamicCityData: DynamicCityData = {
      id: city.id,
      city: city.city,
      country: city.country,
      name: city.name,
      offset: city.offset,
      population: city.population,
      timezone: city.timezone,
      latitude: city.latitude,
      longitude: city.longitude,
      lastUpdated: Date.now() // Add a timestamp
    };
    this.dynamicCities.set(city.id, dynamicCityData);
    // Invalidate relevant cache entries
    this.invalidateCacheForCity(city);
  }

  protected initializeStaticCities(): void {
    const cities = getAvailableTimezones();
    if (!cities) return;

    // Clear cache when cities are re-initialized
    this.searchCache.clear();
    this.cacheAccessTimes.clear();

    cities.forEach((city: Timezone) => {
      const key = `${city.city}|${city.country}`;
      this.staticCities.set(key, city);
    });
    this.staticCitiesLoaded = true;
  }

  async searchCities(query: string, region?: string, limit = 10): Promise<Timezone[]> {
    try {
      const normalizedQuery = query.toLowerCase().trim();
      const cacheKey = `${normalizedQuery}|${region || ''}`;
      let sorted = this.searchCache.get(cacheKey);

      if (!sorted) {
        // Cache miss
        const allCities: Timezone[] = [
          ...Array.from(this.staticCities.values()),
          ...Array.from(this.dynamicCities.values()).map(c => ({
            id: c.id,
            city: c.city,
            country: c.country,
            name: c.name,
            offset: c.offset,
            population: c.population,
            timezone: c.timezone,
            latitude: c.latitude || 0,
            longitude: c.longitude || 0
          }))
        ];

        // Filter logic remains the same
        const results = allCities.filter(city => city && (
          (city.name && city.name.toLowerCase().includes(normalizedQuery)) &&
          (region ? city.country.toLowerCase() === region.toLowerCase() : true)
        ));

        // Sort by population descending
        sorted = results.sort((a, b) => b.population - a.population);

        // Implement proper LRU cache eviction
        if (this.searchCache.size >= this.maxCacheSize) {
          // Find the least recently used key
          let oldestKey = '';
          let oldestTime = Date.now();
          for (const [key, time] of this.cacheAccessTimes) {
            if (time < oldestTime) {
              oldestKey = key;
              oldestTime = time;
            }
          }

          // Remove the least recently used entry
          if (oldestKey) {
            this.searchCache.delete(oldestKey);
            this.cacheAccessTimes.delete(oldestKey);
          }
        }

        // Add the new entry
        this.searchCache.set(cacheKey, sorted);
        this.cacheAccessTimes.set(cacheKey, Date.now());
      } else {
        // Cache hit - update access time
        this.cacheAccessTimes.set(cacheKey, Date.now());
      }

      return sorted.slice(0, limit);
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  }

  async loadCities(): Promise<void> {
    if (this.staticCitiesLoaded) return;
    this.initializeStaticCities();
  }

  getTotalCities(): number {
    try {
      const staticCount = this.staticCities.size;
      const dynamicCount = this.dynamicCities.size;
      return staticCount + dynamicCount;
    } catch (error) {
      console.error('Failed to get total cities count:', error);
      return 0;
    }
  }

  // Public getters and setters for testing
  getCityCache(): Map<string, Timezone> {
    return this.cityCache;
  }

  setCityCache(cityCache: Map<string, Timezone>): void {
    this.cityCache = cityCache;
  }

  getSearchCache(): Map<string, Timezone[]> {
    return this.searchCache;
  }

  setSearchCache(searchCache: Map<string, Timezone[]>): void {
    this.searchCache = searchCache;
    this.cacheAccessTimes.clear();
  }

  getStaticCities(): Map<string, Timezone> {
    return this.staticCities;
  }

  setStaticCities(staticCities: Map<string, Timezone>): void {
    this.staticCities = staticCities;
    // Clear cache when cities are updated
    this.searchCache.clear();
    this.cacheAccessTimes.clear();
  }

  isStaticCitiesLoaded(): boolean {
    return this.staticCitiesLoaded;
  }

  setStaticCitiesLoaded(staticCitiesLoaded: boolean): void {
    this.staticCitiesLoaded = staticCitiesLoaded;
  }
  
  getDynamicCities(): Map<string, DynamicCityData> {
    return this.dynamicCities;
  }
  
  setDynamicCities(dynamicCities: Map<string, DynamicCityData>): void {
    this.dynamicCities = dynamicCities;
  }
  
  getMaxCacheSize(): number {
    return this.maxCacheSize;
  }
  
  setMaxCacheSize(maxCacheSize: number): void {
    this.maxCacheSize = maxCacheSize;
  }

  // Add method to invalidate cache for specific city
  invalidateCacheForCity(city: Timezone): void {
    // Invalidate all cache entries that might contain this city
    const keysToDelete = Array.from(this.searchCache.keys()).filter(key => {
      const [query, region] = key.split('|');
      const lowerQuery = query.toLowerCase();
      const matchesQuery = city.name.toLowerCase().includes(lowerQuery) ||
                          city.country.toLowerCase().includes(lowerQuery);
      const matchesRegion = !region || city.timezone.startsWith(region);
      return matchesQuery && matchesRegion;
    });

    keysToDelete.forEach(key => {
      this.searchCache.delete(key);
      this.cacheAccessTimes.delete(key);
    });
  }

  // Add method to force sync dynamic cities
  async forceSync(): Promise<void> {
    await this.syncDynamicCities();
  }

  // Add method to get last sync time
  getLastSyncTime(): number {
    return this.lastSyncTime;
  }

  // Add method to get dynamic city by ID
  getDynamicCity(id: string): DynamicCityData | undefined {
    return this.dynamicCities.get(id);
  }

  // Add method to clear sync interval
  clearSyncInterval(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }
}

export class DefaultCityService extends CityService {
  async searchCities(query: string, region?: string, limit = 10): Promise<Timezone[]> {
    // Simply call the parent's searchCities method, which handles caching and
    // searching both static and dynamic cities.
    // The parent's searchCities method also handles the region and limit parameters.
    return super.searchCities(query, region, limit);
  }
}

export const cityService = new DefaultCityService();
