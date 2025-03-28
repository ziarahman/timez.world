import { getAvailableTimezones } from '../data/timezones';

export interface City {
  name: string;
  country: string;
  population: number;
  timezone: string;
  latitude: number;
  longitude: number;
}

type Region = 'asia' | 'europe' | 'americas' | 'africa' | 'oceania';

class CityService {
  private loadedRegions: Set<Region> = new Set();
  private cityCache: Map<string, City> = new Map();
  private staticCities: Set<string>;

  constructor() {
    // Create a set of static cities for quick lookup
    this.staticCities = new Set(
      getAvailableTimezones().map(city => `${city.city}|${city.country}`)
    );
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
          this.cityCache.set(key, city);
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

  getLoadedCityCount(): number {
    return this.cityCache.size;
  }

  clearCache(): void {
    this.loadedRegions.clear();
    this.cityCache.clear();
  }
}

export const cityService = new CityService();
