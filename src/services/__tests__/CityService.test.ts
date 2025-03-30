import { CityService } from '../CityService';
import { City } from '../../types';
import { getAvailableTimezones } from '../../data/timezones';
import axios from 'axios';

jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

jest.mock('../../data/timezones', () => ({
  getAvailableTimezones: jest.fn().mockReturnValue([
    { city: 'MockCity', country: 'MockCountry', timezone: 'UTC' }
  ])
}));

// Import DynamicCityData interface from CityService
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

// Create a class that extends CityService and makes protected methods public for testing
class TestableCityService extends CityService {
  // Add properties that we need to access in tests
  protected maxCacheSize = 10;
  // Make protected methods public for testing
  syncDynamicCities(): Promise<void> {
    return super.syncDynamicCities();
  }

  initializeStaticCities(): void {
    super.initializeStaticCities();
  }
  constructor() {
    super();
  }

  setStaticCities(cities: Map<string, City>): void {
    this.staticCities = cities;
  }

  getDynamicCities(): Map<string, DynamicCityData> {
    return this.dynamicCities;
  }

  setDynamicCities(cities: Map<string, DynamicCityData>): void {
    this.dynamicCities = cities;
  }

  getLastSyncTime(): number {
    return this.lastSyncTime;
  }

  setLastSyncTime(time: number): void {
    this.lastSyncTime = time;
  }

  getSyncInterval(): NodeJS.Timeout | null {
    return this.syncInterval;
  }

  setSyncInterval(interval: NodeJS.Timeout | null): void {
    this.syncInterval = interval;
  }

  clearSyncInterval(): void {
    super.clearSyncInterval();
  }

  setStaticCitiesLoaded(loaded: boolean): void {
    this.staticCitiesLoaded = loaded;
  }

  getStaticCitiesLoaded(): boolean {
    return this.staticCitiesLoaded;
  }

  setMaxCacheSize(size: number): void {
    this.maxCacheSize = size;
  }
}



const mockCityData = {
  id: 'Asia/Tokyo',
  city: 'Tokyo',
  country: 'Japan',
  name: 'Tokyo, Japan',
  offset: 9,
  population: 13000000,
  timezone: 'Asia/Tokyo',
  latitude: 35.6895,
  longitude: 139.6917
};

const mockStaticCity = {
  id: 'Asia/Delhi',
  city: 'Delhi',
  country: 'India',
  name: 'Delhi, India',
  offset: 5.5,
  population: 19000000,
  timezone: 'Asia/Kolkata',
  latitude: 28.6139,
  longitude: 77.209
};

describe('CityService', () => {
  let service: TestableCityService;

  const mockCity = {
    id: 'Asia/Kolkata',
    name: 'Delhi, India',
    city: 'Delhi',
    country: 'India',
    timezone: 'Asia/Kolkata',
    latitude: 28.6139,
    longitude: 77.2090,
    population: 19000000,
    offset: 5.5
  };

  // We'll use mockCityData instead of mockDynamicCity for consistency

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TestableCityService();
    service.setSearchCache(new Map()); // Initialize empty search cache
    service.initializeStaticCities();
    mockAxios.get.mockReset();
    service.clearSyncInterval();
    service.setStaticCitiesLoaded(true); // Ensure static cities are marked as loaded
  });

  describe('searchCities', () => {
    it('should return empty array when query is empty', async () => {
      const result = await service.searchCities('');
      expect(result).toEqual([]);
    });

    it('should return matching cities when query matches', async () => {
      // Add mock city to static cities
      service.setStaticCities(new Map([['Delhi|India', mockCity]]));

      const result = await service.searchCities('Delhi');
      expect(result).toEqual([mockCity]);
    });

    describe('Cache Behavior', () => {
      it('should handle cache hit for repeated queries', async () => {
        const mockCity: City = {
          id: 'Asia/Kolkata',
          name: 'Delhi, India',
          city: 'Delhi',
          country: 'India',
          timezone: 'Asia/Kolkata',
          latitude: 28.6139,
          longitude: 77.2090,
          population: 19000000,
          offset: 5.5
        };

        // First search (cache miss)
        service.setSearchCache(new Map());
        service.setStaticCities(new Map([['Delhi|India', mockCity]]));
        const firstResult = await service.searchCities('delhi');
        expect(firstResult).toEqual([mockCity]);

        // Second search (cache hit)
        const secondResult = await service.searchCities('delhi');
        expect(secondResult).toEqual([mockCity]);
      });

      it('should handle cache miss for new queries', async () => {
        const mockCity: City = {
          id: 'Asia/Kolkata',
          name: 'Delhi, India',
          city: 'Delhi',
          country: 'India',
          timezone: 'Asia/Kolkata',
          latitude: 28.6139,
          longitude: 77.2090,
          population: 19000000,
          offset: 5.5
        };

        // Set up cache with different query
        service.setSearchCache(new Map([['mumbai|undefined', [mockCity]]]));
        service.setStaticCities(new Map([['Delhi|India', mockCity]]));

        const result = await service.searchCities('delhi');
        expect(result).toEqual([mockCity]);
      });

      it('should invalidate cache for updated data', async () => {
        const mockCity = {
          id: 'Asia/Kolkata',
          name: 'Delhi, India',
          city: 'Delhi',
          country: 'India',
          timezone: 'Asia/Kolkata',
          latitude: 28.6139,
          longitude: 77.2090,
          population: 19000000,
          offset: 5.5
        };

        // Set up initial cache
        service.setSearchCache(new Map([['delhi|undefined', [mockCity]]]));
        service.setStaticCities(new Map([['Delhi|India', mockCity]]));

        // Update city data
        const updatedCity = { ...mockCity, population: 20000000 };
        service.setStaticCities(new Map([['Delhi|India', updatedCity]]));
        
        // Clear cache explicitly
        service.setSearchCache(new Map());

        const result = await service.searchCities('delhi');
        expect(result).toEqual([updatedCity]);
      });

      it('should construct cache key with region', async () => {
        const mockCity: City = {
          id: 'Asia/Kolkata',
          name: 'Delhi, India',
          city: 'Delhi',
          country: 'India',
          timezone: 'Asia/Kolkata',
          latitude: 28.6139,
          longitude: 77.2090,
          population: 19000000,
          offset: 5.5
        };

        // Set up cache with region
        service.setSearchCache(new Map([['delhi|Asia', [mockCity]]]));
        service.setStaticCities(new Map([['Delhi|India', mockCity]]));

        const result = await service.searchCities('delhi', 'Asia');
        expect(result).toEqual([mockCity]);
      });

      it('should handle cache size limits and eviction', async () => {
        const mockCity1: City = {
          id: 'Asia/Kolkata',
          name: 'Delhi, India',
          city: 'Delhi',
          country: 'India',
          timezone: 'Asia/Kolkata',
          latitude: 28.6139,
          longitude: 77.2090,
          population: 19000000,
          offset: 5.5
        };

        const mockCity2: City = {
          id: 'America/New_York',
          name: 'New York, USA',
          city: 'New York',
          country: 'USA',
          timezone: 'America/New_York',
          latitude: 40.7128,
          longitude: -74.0060,
          population: 8405837,
          offset: -5
        };

        // Set up the service with a max cache size
        const maxCacheSize = 2;
        service.setMaxCacheSize(maxCacheSize);
        
        // Clear the cache first
        service.setSearchCache(new Map());
        
        // Add cities to static cities
        service.setStaticCities(new Map([
          ['Delhi|India', mockCity1],
          ['NewYork|USA', mockCity2],
          ['Tokyo|Japan', {
            id: 'Asia/Tokyo',
            name: 'Tokyo, Japan',
            city: 'Tokyo',
            country: 'Japan',
            timezone: 'Asia/Tokyo',
            latitude: 35.6895,
            longitude: 139.6917,
            population: 13000000,
            offset: 9
          }]
        ]));
        
        // Search for delhi (adds to cache)
        await service.searchCities('delhi');
        
        // Search for newyork (adds to cache)
        await service.searchCities('newyork');
        
        // Search for tokyo (should evict delhi as it's the oldest)
        await service.searchCities('tokyo');
        
        // Verify cache size and contents
        expect(service.getSearchCache().size).toBe(maxCacheSize);
        expect(service.getSearchCache().has('delhi|undefined')).toBe(false);
        expect(service.getSearchCache().has('newyork|undefined')).toBe(true);
        expect(service.getSearchCache().has('tokyo|undefined')).toBe(true);
      });

      it('should use search cache when available', async () => {
        const mockCity: City = {
          id: 'Asia/Kolkata',
          name: 'Delhi, India',
          city: 'Delhi',
          country: 'India',
          timezone: 'Asia/Kolkata',
          latitude: 28.6139,
          longitude: 77.2090,
          population: 19000000,
          offset: 5.5
        };
  
        // Set up static cities and cache
        service.setStaticCities(new Map([['Delhi|India', mockCity]]));
        service.setSearchCache(new Map([['delhi|undefined', [mockCity]]]));
  
        // Search with lowercase query to match cache key
        const result = await service.searchCities('delhi');
        expect(result).toEqual([mockCity]);
      });

      it('should handle partial matches', async () => {
        const mockCity: City = {
          id: 'Asia/Kolkata',
          name: 'New Delhi, India',
          city: 'New Delhi',
          country: 'India',
          timezone: 'Asia/Kolkata',
          latitude: 28.6139,
          longitude: 77.2090,
          population: 19000000,
          offset: 5.5
        };
        service.setStaticCities(new Map([['New Delhi|India', mockCity]]));

        const result = await service.searchCities('Delhi');
        expect(result).toEqual([mockCity]);
      });

      it('should handle special characters in query', async () => {
        const mockCity: City = {
          id: 'America/Sao_Paulo',
          name: 'São Paulo, Brazil',
          city: 'São Paulo',
          country: 'Brazil',
          timezone: 'America/Sao_Paulo',
          latitude: -23.5505,
          longitude: -46.6333,
          population: 12000000,
          offset: -3
        };
        service.setStaticCities(new Map([['São Paulo|Brazil', mockCity]]));

        const result = await service.searchCities('São');
        expect(result).toEqual([mockCity]);
      });
    });

    it('should handle special characters in query', async () => {
      const mockCity: City = {
        id: 'America/Sao_Paulo',
        name: 'São Paulo, Brazil',
        city: 'São Paulo',
        country: 'Brazil',
        timezone: 'America/Sao_Paulo',
        latitude: -23.5505,
        longitude: -46.6333,
        population: 12000000,
        offset: -3
      };
      service.setStaticCities(new Map([['São Paulo|Brazil', mockCity]]));

      const result = await service.searchCities('São');
      expect(result).toEqual([mockCity]);
    });
  });

  describe('Dynamic Cities', () => {
    let service: TestableCityService;

    beforeEach(() => {
      jest.clearAllMocks();
      service = new TestableCityService();
      service.setStaticCities(new Map([['Asia/Delhi|India', mockStaticCity]]));
      
      mockAxios.get.mockResolvedValue({
        status: 200,
        data: { 
          cities: [{
            id: 'Asia/Tokyo',
            city: 'Tokyo',
            country: 'Japan',
            name: 'Tokyo, Japan',
            offset: 9,
            population: 13000000,
            timezone: 'Asia/Tokyo',
            latitude: 35.6895,
            longitude: 139.6917
          }] 
        }
      });
    });

    it('should sync dynamic cities from API', async () => {
      await service.syncDynamicCities();
      
      expect(mockAxios.get).toHaveBeenCalledWith('https://api.example.com/cities');
      const dynamicCities = Array.from(service.getDynamicCities().values());
      expect(dynamicCities).toHaveLength(1);
      expect(dynamicCities[0]).toEqual({
        ...mockCityData,
        lastUpdated: expect.any(Number)
      });
    });

    it('should combine static and dynamic cities in search results', async () => {
      // Set up mock API response
      mockAxios.get.mockResolvedValue({
        status: 200,
        data: { 
          cities: [{
            id: 'Asia/Tokyo',
            city: 'Tokyo',
            country: 'Japan',
            name: 'Tokyo, Japan',
            offset: 9,
            population: 13000000,
            timezone: 'Asia/Tokyo',
            latitude: 35.6895,
            longitude: 139.6917
          }] 
        }
      });
      
      // Set up static cities with Delhi
      service.setStaticCities(new Map([['Delhi|India', {
        id: 'Asia/Delhi',
        city: 'Delhi',
        country: 'India',
        name: 'Delhi, India',
        offset: 5.5,
        population: 19000000,
        timezone: 'Asia/Kolkata',
        latitude: 28.6139,
        longitude: 77.209
      }]]));
      
      // Sync dynamic cities from API
      await service.syncDynamicCities();
      
      // Search for 'to' which should match Tokyo
      const results = await service.searchCities('to');
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 'Asia/Tokyo' })
        ])
      );
    });

    it('should track last sync time', async () => {
      const beforeSync = Date.now();
      await service.syncDynamicCities();
      const lastSync = service.getLastSyncTime();
      
      expect(lastSync).toBeGreaterThanOrEqual(beforeSync);
      expect(lastSync).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('loadCities', () => {
    it('should load cities and set staticCitiesLoaded to true', async () => {
      await service.loadCities();
      expect(service.getStaticCitiesLoaded()).toBe(true);
      expect(service.getStaticCities().size).toBe(1);
    });
  });

  describe('initializeStaticCities', () => {
    it('should initialize static cities from available timezones', () => {
      const mockCities: City[] = [
        { 
          id: 'Asia/Kolkata',
          name: 'Delhi, India',
          city: 'Delhi',
          country: 'India',
          timezone: 'Asia/Kolkata',
          latitude: 28.6139,
          longitude: 77.2090,
          population: 19000000,
          offset: 5.5
        },
        { 
          id: 'America/New_York',
          name: 'New York, USA',
          city: 'New York',
          country: 'USA',
          timezone: 'America/New_York',
          latitude: 40.7128,
          longitude: -74.0060,
          population: 8405837,
          offset: -5
        }
      ];
      (getAvailableTimezones as jest.Mock).mockReturnValue(mockCities);
      
      // Reset static cities before initializing
      service.setStaticCities(new Map());
      service.initializeStaticCities();
      expect(service.getStaticCities().size).toBe(2);
    });
  });

  describe('getTotalCities', () => {
    it('should return total count of static and dynamic cities', () => {
      // Clear existing cities
      service.setStaticCities(new Map());
      service.setDynamicCities(new Map());
      
      // Add one static city
      service.getStaticCities().set('Delhi|India', mockCity);
      
      // Add one dynamic city
      service.getDynamicCities().set('Tokyo|Japan', {
        id: 'Asia/Tokyo',
        city: 'Tokyo',
        country: 'Japan',
        name: 'Tokyo, Japan',
        offset: 9,
        population: 13000000,
        timezone: 'Asia/Tokyo',
        latitude: 35.6895,
        longitude: 139.6917,
        lastUpdated: Date.now()
      });
      
      expect(service.getTotalCities()).toBe(2);
    });
  });

  describe('Total Cities', () => {
    it('should count both static and dynamic cities', async () => {
      // Set up mock API response
      mockAxios.get.mockResolvedValue({
        status: 200,
        data: { 
          cities: [{
            id: 'Asia/Tokyo',
            city: 'Tokyo',
            country: 'Japan',
            name: 'Tokyo, Japan',
            offset: 9,
            population: 13000000,
            timezone: 'Asia/Tokyo',
            latitude: 35.6895,
            longitude: 139.6917
          }] 
        }
      });
      
      // Clear existing cities
      service.setStaticCities(new Map());
      service.setDynamicCities(new Map());
      
      // Add one static city
      service.getStaticCities().set('Delhi|India', mockCity);
      
      // Sync dynamic cities from API
      await service.syncDynamicCities();

      const total = service.getTotalCities();
      expect(total).toBe(2);
    });
  });
});
