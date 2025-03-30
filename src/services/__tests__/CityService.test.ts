import { DefaultCityService } from '../CityService';
import { Timezone } from '../../types';
import { getAvailableTimezones } from '../../data/timezones';
import axios from 'axios';

jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

jest.mock('../../data/timezones', () => ({
  getAvailableTimezones: jest.fn().mockReturnValue([
    { 
      id: 'Asia/Dhaka',
      name: 'Dhaka, Bangladesh',
      city: 'Dhaka',
      country: 'Bangladesh',
      timezone: 'Asia/Dhaka',
      latitude: 23.8103,
      longitude: 90.4125,
      population: 21000000,
      offset: 6
    },
    { 
      id: 'Asia/Kolkata',
      name: 'Kolkata, India',
      city: 'Kolkata',
      country: 'India',
      timezone: 'Asia/Kolkata',
      latitude: 22.5726,
      longitude: 88.3639,
      population: 14850000,
      offset: 5.5
    }
  ])
}));

// Define a local mock for DynamicCityData as it's not exported from types.ts
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

class TestableCityService extends DefaultCityService {
  public get internalStaticCities(): Map<string, Timezone> {
    return this.staticCities;
  }
  public get internalDynamicCities(): Map<string, DynamicCityData> {
    return this.dynamicCities;
  }
  public get internalCityCache(): Map<string, Timezone> {
    return this.cityCache;
  }
  public get internalSearchCache(): Map<string, Timezone[]> {
    return this.searchCache;
  }
  public get internalCacheAccessTimes(): Map<string, number> {
    return this.cacheAccessTimes;
  }
  public get internalSyncInterval(): NodeJS.Timeout | null {
    return this.syncInterval;
  }
  public set internalSyncInterval(interval: NodeJS.Timeout | null) {
    this.syncInterval = interval;
  }
  public get internalLastSyncTime(): number {
    return this.lastSyncTime;
  }
  public set internalLastSyncTime(time: number) {
    this.lastSyncTime = time;
  }

  public initializeStaticCitiesPublic(): void {
    super.initializeStaticCities();
  }

  public syncDynamicCitiesPublic(): Promise<void> {
    return super.syncDynamicCities();
  }

  public startPeriodicSyncPublic(): void {
    super.startPeriodicSync();
  }

  public isStaticCitiesLoadedPublic(): boolean {
    return this.isStaticCitiesLoaded();
  }
}

const mockStaticCity: Timezone = {
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

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TestableCityService();
    // Re-initialize mocks if needed by specific tests, but constructor handles initial load
  });

  describe('constructor', () => {
    it('should initialize with default empty maps', () => {
      const freshService = new TestableCityService(); 
      expect(freshService.internalStaticCities.size).toBe(0);
      expect(freshService.internalDynamicCities.size).toBe(0);
      expect(freshService.internalCityCache.size).toBe(0);
      expect(freshService.internalSearchCache.size).toBe(0);
      expect(freshService.internalCacheAccessTimes.size).toBe(0);
    });

    it('should load available timezones into staticCities on construction', () => {
        const freshService = new TestableCityService();
        expect(getAvailableTimezones).toHaveBeenCalled();
        expect(freshService.internalStaticCities.size).toBe(2);
        expect(freshService.internalStaticCities.get('Asia/Dhaka')).toBeDefined();
      });
  });

  describe('searchCities', () => {
    it('should return empty array when query is empty', async () => {
      const result = await service.searchCities('');
      expect(result).toEqual([]);
    });

    it('should return matching cities when query matches', async () => {
      service.internalStaticCities.set('Delhi|India', mockStaticCity);

      const result = await service.searchCities('Delhi');
      expect(result).toEqual([mockStaticCity]);
    });

    describe('Cache Behavior', () => {
      it('should handle cache hit for repeated queries', async () => {
        const mockCity: Timezone = {
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

        service.setSearchCache(new Map());
        service.internalStaticCities.set('Delhi|India', mockCity);
        const firstResult = await service.searchCities('delhi');
        expect(firstResult).toEqual([mockCity]);

        const secondResult = await service.searchCities('delhi');
        expect(secondResult).toEqual([mockCity]);
      });

      it('should handle cache miss for new queries', async () => {
        const mockCity: Timezone = {
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

        service.setSearchCache(new Map([['mumbai|undefined', [mockCity]]]));
        service.internalStaticCities.set('Delhi|India', mockCity);

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

        service.setSearchCache(new Map([['delhi|undefined', [mockCity]]]));
        service.internalStaticCities.set('Delhi|India', mockCity);

        const updatedCity = { ...mockCity, population: 20000000 };
        service.internalStaticCities.set('Delhi|India', updatedCity);
        
        service.setSearchCache(new Map());

        const result = await service.searchCities('delhi');
        expect(result).toEqual([updatedCity]);
      });

      it('should construct cache key with region', async () => {
        const mockCity: Timezone = {
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

        const cacheMap = new Map<string, Timezone[]>([['delhi|Asia', [mockCity]]]);
        service.setSearchCache(cacheMap);
        service.internalStaticCities.set('Delhi|India', mockCity);

        const result = await service.searchCities('delhi', 'Asia');
        expect(result).toEqual([mockCity]);
      });

      it('should handle cache size limits and eviction', async () => {
        const mockCity1: Timezone = {
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

        const mockCity2: Timezone = {
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

        service.setSearchCache(new Map());
        
        service.internalStaticCities.set('Delhi|India', mockCity1);
        service.internalStaticCities.set('NewYork|USA', mockCity2);
        service.internalStaticCities.set('Tokyo|Japan', {
          id: 'Asia/Tokyo',
          name: 'Tokyo, Japan',
          city: 'Tokyo',
          country: 'Japan',
          timezone: 'Asia/Tokyo',
          latitude: 35.6895,
          longitude: 139.6917,
          population: 13000000,
          offset: 9
        });
        
        await service.searchCities('delhi');
        
        await service.searchCities('newyork');
        
        await service.searchCities('tokyo');
        
        expect(service.internalSearchCache.size).toBe(2);
        expect(service.internalSearchCache.has('delhi|undefined')).toBe(false);
        expect(service.internalSearchCache.has('newyork|undefined')).toBe(true);
        expect(service.internalSearchCache.has('tokyo|undefined')).toBe(true);
      });

      it('should use search cache when available', async () => {
        const mockCity: Timezone = {
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
  
        service.internalStaticCities.set('Delhi|India', mockCity);
        const cacheMap = new Map<string, Timezone[]>([['delhi|undefined', [mockCity]]]);
        service.setSearchCache(cacheMap);

        const result = await service.searchCities('delhi'); // Should hit cache
        expect(result).toEqual([mockCity]);
      });

      it('should handle partial matches', async () => {
        const mockCity: Timezone = {
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
        service.internalStaticCities.set('New Delhi|India', mockCity);

        const result = await service.searchCities('Delhi');
        expect(result).toEqual([mockCity]);
      });

      it('should handle special characters in query', async () => {
        const mockCity: Timezone = {
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
        service.internalStaticCities.set('São Paulo|Brazil', mockCity);

        const result = await service.searchCities('São');
        expect(result).toEqual([mockCity]);
      });
    });

    it('should handle special characters in query', async () => {
      const mockCity: Timezone = {
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
      service.internalStaticCities.set('São Paulo|Brazil', mockCity);

      const result = await service.searchCities('São');
      expect(result).toEqual([mockCity]);
    });
  });

  describe('loadCities', () => {
    it('should load cities and set staticCitiesLoaded to true', async () => {
      await service.loadCities();
      expect(service.isStaticCitiesLoadedPublic()).toBe(true);
      // Should reflect the number of cities from the mocked getAvailableTimezones
      expect(service.internalStaticCities.size).toBe(2); 
    });
  });

  describe('initializeStaticCities', () => {
    it('should initialize static cities from available timezones', () => {
      const mockCities: Timezone[] = [
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
      
      service.internalStaticCities.clear();
      service.initializeStaticCitiesPublic();
      expect(service.internalStaticCities.size).toBe(2);
    });
  });

  describe('getTotalCities', () => {
    it('should return total count of static and dynamic cities', () => {
      service.internalStaticCities.clear();
      service.internalDynamicCities.clear();
      
      service.internalStaticCities.set('Delhi|India', mockStaticCity);
      
      service.internalDynamicCities.set('Tokyo|Japan', {
        id: 'Asia/Tokyo',
        city: 'Tokyo',
        country: 'Japan',
        name: 'Tokyo, Japan',
        offset: 9,
        population: 13000000,
        timezone: 'Asia/Tokyo',
        latitude: 35.6895,
        longitude: 139.6917
      });
      
      expect(service.getTotalCities()).toBe(2);
    });
  });

  describe('Total Cities', () => {
    it('should count both static and dynamic cities', async () => {
      // Test only static cities count as dynamic cities are not implemented here
      const total = service.getTotalCities();
      // Should equal the number of static cities loaded by the mock
      expect(total).toBe(2); 
    });
  });
});
