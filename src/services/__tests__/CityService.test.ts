import { DefaultCityService } from '../CityService';
import { Timezone } from '../../types';

// Mock getAvailableTimezones
// Define mock data directly inside the factory due to Jest hoisting
jest.mock('../../data/timezones', () => {
  const actual = jest.requireActual('../../data/timezones');
  const mockStaticCity1_Hoisted: Timezone = { id: 'static1', name: 'Static City One, SC', city: 'Static City One', country: 'SC', timezone: 'Etc/GMT+1', aliases: [], population: 100000, offset: -60, latitude: 1, longitude: 1 };
  const mockStaticCity2_Hoisted: Timezone = { id: 'static2', name: 'Static City Two, ST', city: 'Static City Two', country: 'ST', timezone: 'Etc/GMT+2', aliases: [], population: 200000, offset: -120, latitude: 2, longitude: 2 };
  return {
    getAvailableTimezones: jest.fn(() => [
      mockStaticCity1_Hoisted,
      mockStaticCity2_Hoisted,
    ]),
    generateTimezoneAliases: actual.generateTimezoneAliases,
  };
});

describe('CityService and DefaultCityService', () => {
  let cityService: DefaultCityService;
  // Reference the hoisted mock data for use in tests if needed, or redefine for clarity
  const mockStaticCity1: Timezone = { id: 'static1', name: 'Static City One, SC', city: 'Static City One', country: 'SC', timezone: 'Etc/GMT+1', aliases: [], population: 100000, offset: -60, latitude: 1, longitude: 1 };
  const mockStaticCity2: Timezone = { id: 'static2', name: 'Static City Two, ST', city: 'Static City Two', country: 'ST', timezone: 'Etc/GMT+2', aliases: [], population: 200000, offset: -120, latitude: 2, longitude: 2 };
  let invalidateCacheSpy: jest.SpyInstance;

  beforeEach(() => {
    // Reset mocks and service instance before each test
    (require('../../data/timezones').getAvailableTimezones as jest.Mock).mockClear();

    // Re-instantiate service to ensure clean state
    cityService = new DefaultCityService();

    // Spy on invalidateCacheForCity from the base class prototype if possible,
    // or on the instance if direct access to base class methods is difficult.
    // For simplicity, if CityService methods are called via 'this', spy on the instance.
    // Note: This spy is on the DefaultCityService instance, but it calls the parent method.
    invalidateCacheSpy = jest.spyOn(cityService as any, 'invalidateCacheForCity');
  });

  afterEach(() => {
    // Restore the spy after each test
    invalidateCacheSpy.mockRestore();
  });

  describe('addDynamicCity', () => {
    const dynamicCity: Timezone = {
      id: 'dynamic1',
      name: 'Dynamic City One, DC',
      city: 'Dynamic City One',
      country: 'DC',
      timezone: 'Etc/GMT+3',
      aliases: [],
      population: 50000,
      offset: -180,
      latitude: 3,
      longitude: 3,
      source: 'api'
    };

    it('should add a city to dynamicCities and invalidate cache', () => {
      cityService.addDynamicCity(dynamicCity);

      expect(cityService.getDynamicCities().size).toBe(1);
      const retrievedCity = cityService.getDynamicCity('dynamic1');
      expect(retrievedCity).toBeDefined();
      expect(retrievedCity?.name).toBe('Dynamic City One, DC');
      expect(retrievedCity?.lastUpdated).toBeDefined(); // Check for timestamp
      expect(invalidateCacheSpy).toHaveBeenCalledWith(dynamicCity);
    });

    it('should overwrite an existing dynamic city with the same ID', () => {
      cityService.addDynamicCity(dynamicCity);
      const updatedDynamicCity = { ...dynamicCity, name: 'Updated Dynamic City', population: 60000 };
      cityService.addDynamicCity(updatedDynamicCity);

      expect(cityService.getDynamicCities().size).toBe(1);
      expect(cityService.getDynamicCity('dynamic1')?.name).toBe('Updated Dynamic City');
      expect(cityService.getDynamicCity('dynamic1')?.population).toBe(60000);
      expect(invalidateCacheSpy).toHaveBeenCalledTimes(2); // Called for each add
    });
  });

  describe('searchCities (via DefaultCityService)', () => {
    const dynamicCityForSearch: Timezone = { id: 'dynamicSearch1', name: 'Dynamic Search City, DS', city: 'Dynamic Search City', country: 'DS', timezone: 'Etc/GMT+4', aliases: [], population: 75000, offset: -240, latitude: 4, longitude: 4, source: 'api' };

    beforeEach(() => {
      // Static cities are loaded by mock in constructor
      // Add a dynamic city for search tests
      cityService.addDynamicCity(dynamicCityForSearch);
    });

    it('should find static cities by query', async () => {
      const results = await cityService.searchCities('Static City One');
      expect(results.length).toBe(1);
      expect(results[0].id).toBe('static1');
    });

    it('should find dynamic cities by query', async () => {
      const results = await cityService.searchCities('Dynamic Search City');
      expect(results.length).toBe(1);
      expect(results[0].id).toBe('dynamicSearch1');
    });

    it('should find both static and dynamic cities with a general query', async () => {
      const results = await cityService.searchCities('City'); // Matches "Static City One", "Static City Two", "Dynamic Search City"
      expect(results.length).toBe(3);
      expect(results.some(c => c.id === 'static1')).toBe(true);
      expect(results.some(c => c.id === 'static2')).toBe(true);
      expect(results.some(c => c.id === 'dynamicSearch1')).toBe(true);
    });

    it('should return empty array for no match', async () => {
      const results = await cityService.searchCities('NonExistentCityName');
      expect(results.length).toBe(0);
    });

    it('should filter by region, including dynamic cities', async () => {
      // Assuming mockStaticCity1 is 'SC' country and dynamicCityForSearch is 'DS' country
      // And base CityService search logic correctly filters by country for region (this is a simplification)
      // For more accurate region test, timezones should be used (e.g., 'Europe/London')
      // The current base searchCities filters by city.country matching region string.

      const resultsSC = await cityService.searchCities('City', 'SC');
      expect(resultsSC.length).toBe(1);
      expect(resultsSC.find(c => c.id === 'static1')).toBeDefined();

      const resultsDS = await cityService.searchCities('City', 'DS');
      expect(resultsDS.length).toBe(1);
      expect(resultsDS.find(c => c.id === 'dynamicSearch1')).toBeDefined();

      const resultsST = await cityService.searchCities('City', 'ST');
      expect(resultsST.length).toBe(1);
      expect(resultsST.find(c => c.id === 'static2')).toBeDefined();

      const resultsNonExistentRegion = await cityService.searchCities('City', 'NonExistentRegion');
      expect(resultsNonExistentRegion.length).toBe(0);
    });

    it('should use cache for repeated queries (static and dynamic)', async () => {
      // First search - should populate cache
      await cityService.searchCities('City');
      const searchCache = cityService.getSearchCache(); // Accessing for test verification
      const initialCacheKey = 'city|'; // Default region is empty string
      expect(searchCache.has(initialCacheKey)).toBe(true);
      const cachedResults = searchCache.get(initialCacheKey);
      expect(cachedResults?.length).toBe(3);

      // To verify cache is USED, we'd ideally spy on the filter/map logic within searchCities,
      // but that's too implementation-specific. Instead, we check if access time is updated.
      const accessTimes = (cityService as any).cacheAccessTimes as Map<string, number>;
      const initialTime = accessTimes.get(initialCacheKey) || 0;

      // Second search - should use cache
      await new Promise(resolve => setTimeout(resolve, 10)); // Ensure time progresses
      const results = await cityService.searchCities('City');
      expect(results.length).toBe(3); // Same results
      
      const newTime = accessTimes.get(initialCacheKey) || 0;
      expect(newTime).toBeGreaterThan(initialTime); // Access time updated
    });

    it('should respect the limit parameter', async () => {
        const results = await cityService.searchCities('City', undefined, 1);
        expect(results.length).toBe(1);
      });
  });

  describe('getTotalCities', () => {
    it('should return count of static cities initially', () => {
      // Based on the mock, 2 static cities are loaded
      expect(cityService.getTotalCities()).toBe(2);
    });

    it('should return correct count after adding a dynamic city', () => {
      const initialCount = cityService.getTotalCities(); // Should be 2
      const dynamicCity: Timezone = { id: 'dynamicTotal1', name: 'Dynamic Total City, DT', city: 'Dynamic Total City', country: 'DT', timezone: 'Etc/GMT+5', aliases: [], population: 10000, offset: -300, latitude: 5, longitude: 5, source: 'api' };
      cityService.addDynamicCity(dynamicCity);
      expect(cityService.getTotalCities()).toBe(initialCount + 1);
    });

    it('should return correct count after adding multiple dynamic cities', () => {
        const initialCount = cityService.getTotalCities(); // Should be 2
        cityService.addDynamicCity({ id: 'd1', name: 'D1', city: 'D1', country: 'D', timezone: 'TZ', aliases: [], population: 1, offset: 0, latitude: 0, longitude: 0, source: 'api' });
        cityService.addDynamicCity({ id: 'd2', name: 'D2', city: 'D2', country: 'D', timezone: 'TZ', aliases: [], population: 1, offset: 0, latitude: 0, longitude: 0, source: 'api' });
        expect(cityService.getTotalCities()).toBe(initialCount + 2);
      });

    it('should not change count if adding dynamic city with existing ID', () => {
        const dynamicCity: Timezone = { id: 'dynamicTotal1', name: 'Dynamic Total City, DT', city: 'Dynamic Total City', country: 'DT', timezone: 'Etc/GMT+5', aliases: [], population: 10000, offset: -300, latitude: 5, longitude: 5, source: 'api' };
        cityService.addDynamicCity(dynamicCity);
        const countAfterFirstAdd = cityService.getTotalCities();
        cityService.addDynamicCity({ ...dynamicCity, name: "Updated Name" }); // Same ID
        expect(cityService.getTotalCities()).toBe(countAfterFirstAdd);
      });
  });
});
