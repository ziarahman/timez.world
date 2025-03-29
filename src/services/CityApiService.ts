import { City } from '../types';

interface CityApiResponse {
  data: Array<{
    city: string;
    country: string;
    latitude: number;
    longitude: number;
  }>;
}

interface OpenCageResponse {
  results: Array<{
    components: {
      city?: string;
      country?: string;
    };
    geometry: {
      lat: number;
      lng: number;
    };
  }>;
}

interface OpenWeatherResponse {
  name: string;
  sys: {
    country: string;
  };
  coord: {
    lat: number;
    lon: number;
  };
}

interface NominatimResponse {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    country?: string;
  };
}

interface TimezoneDbResponse {
  status: string;
  zoneName: string;
}

function formatTimezone(timezone: string): string {
  // First check if it's already a valid IANA timezone
  const validIANA = timezone.match(/^[A-Za-z]+\/[A-Za-z0-9_]+$/);
  if (validIANA) {
    return timezone;
  }

  // Handle special cases
  const specialCases = {
    'sylhet': 'Asia/Dhaka',
    'singapore': 'Asia/Singapore',
    'asia_singapore': 'Asia/Singapore',
    'asia_dhaka': 'Asia/Dhaka',
    'asia_shanghai': 'Asia/Shanghai',
    'asia_tokyo': 'Asia/Tokyo',
    'asia_seoul': 'Asia/Seoul',
    'asia_beijing': 'Asia/Shanghai', // Beijing uses Shanghai timezone
    'asia_hong_kong': 'Asia/Hong_Kong',
    'asia_taipei': 'Asia/Taipei',
    'asia_manila': 'Asia/Manila',
    'asia_jakarta': 'Asia/Jakarta',
    'asia_kuala_lumpur': 'Asia/Kuala_Lumpur',
    'asia_bangkok': 'Asia/Bangkok',
    'asia_ho_chi_minh': 'Asia/Ho_Chi_Minh',
    'asia_hanoi': 'Asia/Hanoi',
    'asia_colombo': 'Asia/Colombo',
    'asia_karachi': 'Asia/Karachi',
    'asia_istanbul': 'Europe/Istanbul',
    'asia_moscow': 'Europe/Moscow',
    'asia_berlin': 'Europe/Berlin',
    'asia_london': 'Europe/London',
    'asia_paris': 'Europe/Paris',
    'asia_rome': 'Europe/Rome',
    'asia_madrid': 'Europe/Madrid',
    'asia_athens': 'Europe/Athens',
    'asia_cairo': 'Africa/Cairo',
    'asia_johannesburg': 'Africa/Johannesburg',
    'asia_lagos': 'Africa/Lagos'
  };

  // Handle Singapore specifically
  if (timezone.toLowerCase().includes('singapore')) {
    return 'Asia/Singapore';
  }

  // Check if it's a special case
  const normalized = timezone.toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/_+/g, '_') // Replace multiple underscores with single underscore
    .replace(/_$/, ''); // Remove trailing underscore

  const cityPart = normalized.split('_').pop() || normalized;
  const specialCase = specialCases[cityPart];
  if (specialCase) {
    return specialCase;
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
    'singapore': 'Singapore', // Handle Singapore specifically
    // Add more known cities as needed
  };

  // Split the timezone into parts
  const parts = normalized.split('_');
  const continent = parts[0];
  const city = parts[1] || parts[0];

  // Get the proper continent name
  const properContinent = continentMap[continent] || continent.charAt(0).toUpperCase() + continent.slice(1);
  // Get the proper city name
  const properCity = knownCities[city] || city.charAt(0).toUpperCase() + city.slice(1);

  // Return in IANA format
  return `${properContinent}/${properCity}`;
}

export class CityApiService {
  private static instance: CityApiService;
  private readonly API_PROVIDERS = [
    {
      name: 'GeoDB Cities',
      url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities',
      headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_GEODB_API_KEY || 'YOUR_API_KEY',
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
      },
      params: (query: string) => ({
        namePrefix: query,
        limit: 10,
        hateoasMode: false
      }),
      enabled: true,
      rateLimitReset: 0
    },
    {
      name: 'OpenCage Geocoding',
      url: 'https://api.opencagedata.com/geocode/v1/json',
      headers: {
        'Content-Type': 'application/json'
      },
      params: (query: string) => ({
        q: query,
        key: import.meta.env.VITE_OPENCAGE_API_KEY || 'YOUR_API_KEY',
        limit: 10,
        language: 'en'
      }),
      enabled: true,
      rateLimitReset: 0
    },
    {
      name: 'OpenWeatherMap',
      url: 'https://api.openweathermap.org/geo/1.0/direct',
      headers: {
        'Content-Type': 'application/json'
      },
      params: (query: string) => ({
        q: query,
        limit: 10,
        appid: import.meta.env.VITE_OPENWEATHER_API_KEY || 'YOUR_API_KEY'
      }),
      enabled: true,
      rateLimitReset: 0
    },
    {
      name: 'Nominatim',
      url: 'https://nominatim.openstreetmap.org/search',
      headers: {
        'Content-Type': 'application/json'
      },
      params: (query: string) => ({
        q: query,
        format: 'jsonv2',
        limit: 10,
        countrycodes: 'all',
        addressdetails: 1
      }),
      enabled: true,
      rateLimitReset: 0
    }
  ];

  private constructor() {}

  static getInstance(): CityApiService {
    if (!CityApiService.instance) {
      CityApiService.instance = new CityApiService();
    }
    return CityApiService.instance;
  }

  private async fetchFromProvider(provider: any, query: string): Promise<City[]> {
    try {
      if (!provider.enabled) {
        throw new Error(`Provider ${provider.name} is temporarily disabled`);
      }

      const params = new URLSearchParams(provider.params(query));
      const response = await fetch(`${provider.url}?${params.toString()}`, {
        headers: provider.headers
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 429 || errorText.toLowerCase().includes('too many requests')) {
          // Disable this provider temporarily
          provider.enabled = false;
          // Set reset time to 5 minutes from now
          provider.rateLimitReset = Date.now() + (5 * 60 * 1000);
          throw new Error(`Provider ${provider.name} is rate limited. Will be available again in 5 minutes. Status code: ${response.status}. Error text: ${errorText}`);
        }
        throw new Error(`Provider ${provider.name} failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      const cities = [];
      
      if (provider.name === 'GeoDB Cities') {
        const cityData = (data as CityApiResponse).data;
        for (const city of cityData) {
          const timezone = await this.getTimezoneForCoordinates(city.latitude, city.longitude);
          if (timezone) {
            cities.push({
              city: city.city,
              name: city.city,
              country: city.country,
              timezone,
              latitude: city.latitude,
              longitude: city.longitude,
              population: 0,
              offset: 0
            });
          }
        }
      } else if (provider.name === 'OpenCage Geocoding') {
        const results = (data as OpenCageResponse).results;
        for (const result of results) {
          const timezone = await this.getTimezoneForCoordinates(result.geometry.lat, result.geometry.lng);
          if (timezone) {
            cities.push({
              city: result.components.city || query,
              name: result.components.city || query,
              country: result.components.country || 'Unknown',
              timezone,
              latitude: result.geometry.lat,
              longitude: result.geometry.lng,
              population: 0,
              offset: 0
            });
          }
        }
      } else if (provider.name === 'OpenWeatherMap') {
        const results = (data as OpenWeatherResponse[]);
        for (const result of results) {
          const timezone = await this.getTimezoneForCoordinates(result.coord.lat, result.coord.lon);
          if (timezone) {
            cities.push({
              city: result.name,
              name: result.name,
              country: result.sys.country,
              timezone,
              latitude: result.coord.lat,
              longitude: result.coord.lon,
              population: 0,
              offset: 0
            });
          }
        }
      } else if (provider.name === 'Nominatim') {
        const results = (data as NominatimResponse[]);
        for (const result of results) {
          const timezone = await this.getTimezoneForCoordinates(parseFloat(result.lat), parseFloat(result.lon));
          if (timezone) {
            cities.push({
              city: result.address.city || query,
              name: result.address.city || query,
              country: result.address.country || 'Unknown',
              timezone,
              latitude: parseFloat(result.lat),
              longitude: parseFloat(result.lon),
              population: 0,
              offset: 0
            });
          }
        }
      }

      return cities;
    } catch (error) {
      console.error(`Error from ${provider.name}:`, {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error: error
      });
      throw new Error(`Provider ${provider.name} failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async getTimezoneForCoordinates(lat: number, lng: number): Promise<string | null> {
    try {
      const response = await fetch(`https://api.timezonedb.com/v2.1/get-time-zone?key=${import.meta.env.VITE_TIMEZONEDB_API_KEY || 'YOUR_API_KEY'}&format=json&by=position&lat=${lat}&lng=${lng}`);
      if (!response.ok) {
        throw new Error(`TimezoneDB API failed with status ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 'OK') {
        // Convert timezone ID to proper IANA format
        const timezone = formatTimezone(data.zoneName);
        return timezone;
      }
      return null;
    } catch (error) {
      console.error('Error getting timezone:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error: error
      });
      return null;
    }
  }

  async searchCities(query: string, limit = 10): Promise<City[]> {
    try {
      let results: City[] = [];
      let providerError: string | null = null;

      // First try enabled providers
      for (const provider of this.API_PROVIDERS) {
        if (provider.enabled) {
          try {
            console.log(`Trying provider: ${provider.name}`);
            const providerResults = await this.fetchFromProvider(provider, query);
            if (providerResults.length > 0) {
              // Filter out cities with invalid timezones
              results = providerResults.filter(city => city.timezone && city.timezone !== 'Unknown');
              if (results.length > 0) {
                break;
              }
            }
          } catch (error) {
            console.error(`Provider ${provider.name} failed:`, error);
            providerError = error instanceof Error ? error.message : 'Unknown error';
          }
        }
      }

      // If no results and there are disabled providers, try them
      if (results.length === 0) {
        for (const provider of this.API_PROVIDERS) {
          if (!provider.enabled && Date.now() >= provider.rateLimitReset) {
            // Re-enable the provider since the reset time has passed
            provider.enabled = true;
            try {
              console.log(`Retrying disabled provider: ${provider.name}`);
              const providerResults = await this.fetchFromProvider(provider, query);
              if (providerResults.length > 0) {
                results = providerResults.filter(city => city.timezone && city.timezone !== 'Unknown');
                if (results.length > 0) {
                  break;
                }
              }
            } catch (error) {
              console.error(`Provider ${provider.name} still failing:`, error);
            }
          }
        }
      }

      if (results.length === 0 && providerError) {
        throw new Error(`All providers failed: ${providerError}`);
      }

      return results;
    } catch (error) {
      console.error('Error searching cities:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error: error
      });
      throw error;
    }
  }
}
