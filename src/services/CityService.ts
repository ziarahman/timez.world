import { getAvailableTimezones } from '../data/timezones';
import { City, Timezone } from '../types';
import axios from 'axios';

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
  protected staticCities: Map<string, City> = new Map();
  protected dynamicCities: Map<string, DynamicCityData> = new Map();
  protected cityCache: Map<string, City> = new Map();
  protected searchCache: Map<string, City[]> = new Map();
  protected cacheAccessTimes: Map<string, number> = new Map(); // Track access times
  protected lastSyncTime: number = 0;
  protected syncInterval: NodeJS.Timeout | null = null;
  protected staticCitiesLoaded: boolean = false;
  protected maxCacheSize: number = 10; // Default max cache size

  constructor() {
    // Initialize static cities
    this.initializeStaticCities();
    
    // Start periodic sync
    this.startPeriodicSync();
  }

  protected startPeriodicSync(): void {
    // Clear existing interval if any
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    // Sync every 5 minutes
    this.syncInterval = setInterval(() => {
      this.syncDynamicCities()
        .catch(error => console.error('Failed to sync dynamic cities:', error));
    }, 5 * 60 * 1000);

    // Initial sync
    this.syncDynamicCities()
      .catch(error => console.error('Initial sync failed:', error));
  }

  protected async syncDynamicCities(): Promise<void> {
    try {
      const response = await axios.get('https://api.example.com/cities');
      if (!response || !response.data || !response.data.cities || !Array.isArray(response.data.cities)) {
        throw new Error('Invalid API response');
      }
      
      // Validate each city object in the response
      const cities = response.data.cities.filter((city: DynamicCityData) => 
        city &&
        typeof city.id === 'string' &&
        typeof city.city === 'string' &&
        typeof city.country === 'string' &&
        typeof city.name === 'string' &&
        typeof city.offset === 'number' &&
        typeof city.population === 'number' &&
        typeof city.timezone === 'string'
      );

      if (cities.length === 0) {
        throw new Error('No valid cities found in API response');
      }
      
      // Update dynamic cities
      const updatedCities = new Map<string, DynamicCityData>();
      for (const city of cities) {
        updatedCities.set(city.id, {
          ...city,
          lastUpdated: Date.now()
        });
      }
      
      // Update dynamic cities and clear cache
      this.dynamicCities = updatedCities;
      this.lastSyncTime = Date.now();
      this.searchCache.clear();
      this.cacheAccessTimes.clear();
    } catch (error) {
      console.error('Failed to sync dynamic cities:', error);
      throw error;
    }
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

  async searchCities(query: string, region?: string, limit = 10): Promise<City[]> {
    try {
      const normalizedQuery = query.toLowerCase().trim();
      const cacheKey = `${normalizedQuery}|${region || ''}`;
      let sorted = this.searchCache.get(cacheKey);

      if (!sorted) {
        // Cache miss
        const allCities: City[] = [
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
  getCityCache(): Map<string, City> {
    return this.cityCache;
  }

  setCityCache(cityCache: Map<string, City>): void {
    this.cityCache = cityCache;
  }

  getSearchCache(): Map<string, City[]> {
    return this.searchCache;
  }

  setSearchCache(searchCache: Map<string, City[]>): void {
    this.searchCache = searchCache;
    this.cacheAccessTimes.clear();
  }

  getStaticCities(): Map<string, City> {
    return this.staticCities;
  }

  setStaticCities(staticCities: Map<string, City>): void {
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
  invalidateCacheForCity(city: City): void {
    // Invalidate all cache entries that might contain this city
    const keysToDelete = Array.from(this.searchCache.keys()).filter(key => {
      const [query, region] = key.split('|');
      const lowerQuery = query.toLowerCase();
      const matchesQuery = city.city.toLowerCase().includes(lowerQuery) ||
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
  async searchCities(query: string): Promise<City[]> {
    if (!query.trim()) {
      return [];
    }
    
    const lowerQuery = query.toLowerCase();
    console.log('Searching for:', lowerQuery);
    console.log('Cache contents:', this.searchCache);
    
    // Check cache first
    const cachedResults = this.searchCache.get(lowerQuery);
    if (cachedResults) {
      console.log('Cache hit for:', lowerQuery);
      // Update access time
      this.cacheAccessTimes.set(lowerQuery, Date.now());
      return cachedResults;
    }
    
    // If not in cache, search static cities
    const results = Array.from(this.staticCities.values())
      .filter(city => 
        city.city.toLowerCase().includes(lowerQuery) || 
        city.country.toLowerCase().includes(lowerQuery)
      );
      
    // Store in cache
    this.searchCache.set(lowerQuery, results);
    
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

    this.cacheAccessTimes.set(lowerQuery, Date.now()); // Add the new key to the cache access times

    console.log('Cache miss for:', lowerQuery, 'Storing:', results);
    return results;
  }
}

export const cityService = new DefaultCityService();
