import { db, CityRecord } from './CityDatabase';
import { getAvailableTimezones } from '../data/timezones';

export async function initializeDatabase(): Promise<void> {
  try {
    // Delete existing database to start fresh
    await db.delete();
    await db.open();
    
    // Get initial cities from current data
    const initialCities = getAvailableTimezones().map(city => ({
      name: city.city,
      country: city.country,
      population: city.population || 0,
      timezone: city.id,
      latitude: 0,
      longitude: 0,
      isPopular: true
    }));

    // Add initial cities
    console.log('Adding initial cities:', initialCities.length);
    await db.cities.bulkPut(initialCities);

    // Load additional cities if available
    try {
      const response = await fetch('/data/world-cities.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const cityData = await response.json();
      
      // Filter and transform cities
      const additionalCities = cityData
        .filter((city: any) => city.population > 100000)
        .map((city: any) => ({
          name: city.name,
          country: city.country,
          population: parseInt(city.population) || 0,
          timezone: city.timezone,
          latitude: parseFloat(city.lat) || 0,
          longitude: parseFloat(city.lng) || 0,
          isPopular: parseInt(city.population) > 1000000
        }));

      // Add in smaller batches
      const BATCH_SIZE = 100;
      console.log('Adding additional cities:', additionalCities.length);
      for (let i = 0; i < additionalCities.length; i += BATCH_SIZE) {
        const batch = additionalCities.slice(i, i + BATCH_SIZE);
        await db.cities.bulkPut(batch);
      }
    } catch (error) {
      console.warn('Failed to load additional cities:', error);
      // Continue with just the initial cities
    }
  } catch (error) {
    console.error('Failed to load additional city data:', error);
  }
}

async function decompressAndParse(compressedData: ArrayBuffer): Promise<any[]> {
  // We'll implement this later when we add the compressed data file
  // For now, return empty array
  return [];
}
