import Dexie, { Table } from 'dexie';
import { DateTime } from 'luxon';

export interface CityRecord {
  id?: number;
  name: string;
  country: string;
  population: number;
  timezone: string;
  latitude: number;
  longitude: number;
  isPopular: boolean;
}

export class CityDatabase extends Dexie {
  cities!: Table<CityRecord>;

  constructor() {
    super('CityDatabase');
    this.version(5).stores({
      cities: '++id, name, country, timezone'
    });
  }

  async getTotalCityCount(): Promise<number> {
    return await this.cities.count();
  }

  async searchCities(query: string, limit = 50): Promise<CityRecord[]> {
    const normalizedQuery = query.toLowerCase();
    const cities = await this.cities.toArray();
    return cities
      .filter(city => 
        city.name.toLowerCase().includes(normalizedQuery) ||
        city.country.toLowerCase().includes(normalizedQuery)
      )
      .sort((a, b) => b.population - a.population)
      .slice(0, limit);
  }

  async getPopularCities(limit = 100): Promise<CityRecord[]> {
    const cities = await this.cities
      .where('isPopular')
      .equals(true)
      .toArray();
    
    return cities
      .sort((a, b) => b.population - a.population)
      .slice(0, limit);
  }

  async getRecentCities(limit = 10): Promise<CityRecord[]> {
    return this.cities
      .orderBy('lastUsed')
      .reverse()
      .limit(limit)
      .toArray();
  }

  async updateLastUsed(cityId: number): Promise<void> {
    await this.cities.update(cityId, { lastUsed: new Date() });
  }
}

export const db = new CityDatabase();
