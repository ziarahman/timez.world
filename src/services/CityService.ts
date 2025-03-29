import { getAvailableTimezones } from '../data/timezones';
import { City } from '../types';

type Region = 'asia' | 'europe' | 'americas' | 'africa' | 'oceania';

interface CityData {
  cities: City[];
  lastUpdated: number;
}

class CityService {
  private loadedRegions: Set<Region> = new Set();
  private cityCache: Map<string, City> = new Map();
  private staticCities: Set<string>;
  private readonly STORAGE_KEY = 'worldtimez_cities';

  constructor() {
    // Create a set of static cities for quick lookup
    this.staticCities = new Set(
      getAvailableTimezones().map(city => `${city.city}|${city.country}`)
    );
    
    // Load saved cities from localStorage
    const savedCities = localStorage.getItem(this.STORAGE_KEY);
    if (savedCities) {
      try {
        const data: CityData = JSON.parse(savedCities);
        // Only use saved data if it's less than 7 days old
        if (data.lastUpdated > Date.now() - 7 * 24 * 60 * 60 * 1000) {
          data.cities.forEach(city => {
            const key = `${city.name}|${city.country}`;
            if (!this.staticCities.has(key)) {
              // Format timezone before adding to cache
              const formattedTimezone = formatTimezone(city.timezone);
              this.cityCache.set(key, {
                ...city,
                timezone: formattedTimezone
              });
            }
          });
        }
      } catch (error) {
        console.error('Error loading saved cities:', error);
      }
    }
  }

  private async loadRegion(region: Region): Promise<City[]> {
    if (this.loadedRegions.has(region)) {
      return [];
    }

    try {
      const response = await fetch(`/data/cities/${region}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${region} cities`);
      }

      const cities: City[] = await response.json();
      
      // Add to cache and filter out static cities
      cities.forEach(city => {
        const key = `${city.name}|${city.country}`;
        if (!this.staticCities.has(key)) {
          // Format timezone before adding to cache
          const formattedTimezone = formatTimezone(city.timezone);
          this.cityCache.set(key, {
            ...city,
            timezone: formattedTimezone
          });
        }
      });

      this.loadedRegions.add(region);
      return cities;
    } catch (error) {
      console.error(`Error loading ${region} cities:`, error);
      return [];
    }
  }

  async searchCities(query: string, region: string = 'all', limit = 50): Promise<City[]> {
    const normalizedQuery = query.toLowerCase();
    
    // Load specific region or all regions
    if (region === 'all') {
      if (this.loadedRegions.size === 0) {
        await Promise.all([
          this.loadRegion('asia'),
          this.loadRegion('europe'),
          this.loadRegion('americas'),
          this.loadRegion('africa'),
          this.loadRegion('oceania')
        ]);
      }
    } else if (!this.loadedRegions.has(region as Region)) {
      await this.loadRegion(region as Region);
    }

    // Search through cached cities
    const results: City[] = [];
    for (const city of this.cityCache.values()) {
      // Filter by region if specified
      if (region !== 'all') {
        const continentMap = {
          'asia': ['Asia'],
          'europe': ['Europe'],
          'americas': ['America', 'Canada'],
          'africa': ['Africa'],
          'oceania': ['Australia', 'Pacific']
        };
        
        const continentPrefixes = continentMap[region as Region];
        const matchesRegion = continentPrefixes.some(prefix => 
          city.timezone.startsWith(prefix)
        );
        
        if (!matchesRegion) {
          continue;
        }
      }

      // Filter by search query if provided
      if (query.length >= 2 && 
          !city.name.toLowerCase().includes(normalizedQuery) &&
          !city.country.toLowerCase().includes(normalizedQuery)) {
        continue;
      }

      results.push(city);
      if (results.length >= limit) {
        break;
      }
    }

    // Sort by population
    return results.sort((a, b) => b.population - a.population);
  }

  addCity(city: City): void {
    const key = `${city.name}|${city.country}`;
    if (!this.staticCities.has(key)) {
      // Format the timezone ID to match IANA format
      const formattedTimezone = formatTimezone(city.timezone);
      
      this.cityCache.set(key, {
        ...city,
        timezone: formattedTimezone
      });
      
      // Save to localStorage
      const cities = Array.from(this.cityCache.values());
      const data: CityData = {
        cities,
        lastUpdated: Date.now()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }
  }

  getLoadedCityCount(): number {
    return this.cityCache.size;
  }

  getTotalCities(): number {
    // Count static cities
    const staticCount = this.staticCities.size;
    
    // Count dynamically added cities
    const dynamicCount = Array.from(this.cityCache.keys())
      .filter(key => !this.staticCities.has(key))
      .length;

    return staticCount + dynamicCount;
  }

  clearCache(): void {
    this.loadedRegions.clear();
    this.cityCache.clear();
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

// Helper function to format timezone IDs to match IANA format
function formatTimezone(timezone: string): string {
  // First check if it's already a valid IANA timezone
  const validIANA = timezone.match(/^[A-Za-z]+\/[A-Za-z0-9_]+$/);
  if (validIANA) {
    return timezone;
  }

  // Try to match against known continent/city format
  const continentMap = {
    'asia': 'Asia',
    'europe': 'Europe',
    'americas': 'America',
    'africa': 'Africa',
    'oceania': 'Australia'
  };

  // Try to match the city name against known cities
  const knownCities = {
    'dhaka': 'Dhaka',
    'sylhet': 'Dhaka', // Sylhet is in the same timezone as Dhaka
    // Add more known cities as needed
  };

  // Split the timezone into parts
  const parts = timezone.toLowerCase().split('_');
  const continent = parts[0];
  const city = parts[1] || parts[0];

  // Get the proper continent name
  const properContinent = continentMap[continent] || continent.charAt(0).toUpperCase() + continent.slice(1);
  // Get the proper city name
  const properCity = knownCities[city] || city.charAt(0).toUpperCase() + city.slice(1);

  // Return in IANA format
  return `${properContinent}/${properCity}`;
}

export const cityService = new CityService();
