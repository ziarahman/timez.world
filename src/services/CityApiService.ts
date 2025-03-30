import axios from 'axios';

interface ProviderConfig {
  name: string;
  url: string;
  headers: { [key: string]: string };
  params: (query: string) => { [key: string]: string };
  enabled: boolean;
  rateLimitReset: number;
}

interface CityApiResponse {
  data: Array<{
    name: string;
    country: string;
    timezone: string;
    population: number;
    latitude: number;
    longitude: number;
    offset: number;
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

interface City {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  id: string;
  source?: string;
}

export class CityApiService {
  private static instance: CityApiService;
  private readonly API_PROVIDERS: ProviderConfig[] = [
    {
      name: 'GeoDB Cities',
      url: import.meta.env.VITE_GEO_DB_API_URL || 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities',
      headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_GEO_DB_API_KEY || '',
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
      },
      params: (query: string) => ({
        namePrefix: query,
        limit: '10',
        sort: 'population',
        order: 'desc'
      }),
      enabled: true,
      rateLimitReset: 0
    },
    {
      name: 'OpenWeatherMap',
      url: import.meta.env.VITE_OPENWEATHER_API_URL || 'http://api.openweathermap.org/geo/1.0/direct',
      headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_OPENWEATHER_API_KEY || '',
        'X-RapidAPI-Host': 'api.openweathermap.org'
      },
      params: (query: string) => ({
        q: query,
        limit: '10',
        appid: import.meta.env.VITE_OPENWEATHER_API_KEY || ''
      }),
      enabled: true,
      rateLimitReset: 0
    },
    {
      name: 'Nominatim',
      url: import.meta.env.VITE_NOMINATIM_API_URL || 'https://nominatim.openstreetmap.org/search',
      headers: {
        'User-Agent': 'worldtimez-app'
      },
      params: (query: string) => ({
        q: query,
        format: 'json',
        limit: '10',
        countrycodes: 'US,CA,GB,AU,NZ',
        addressdetails: '1'
      }),
      enabled: true,
      rateLimitReset: 0
    }
  ];

  private constructor() {}

  public static getInstance(): CityApiService {
    if (!CityApiService.instance) {
      CityApiService.instance = new CityApiService();
    }
    return CityApiService.instance;
  }

  private async fetchFromProvider(provider: ProviderConfig, query: string): Promise<CityApiResponse> {
    try {
      if (!provider.enabled) {
        throw new Error(`Provider ${provider.name} is temporarily disabled`);
      }

      const response = await axios.get(provider.url, {
        headers: provider.headers,
        params: provider.params(query)
      });

      if (!response.data) {
        throw new Error(`Provider ${provider.name} returned no data`);
      }

      if (provider.name === 'GeoDB Cities') {
        return response.data as CityApiResponse;
      } else if (provider.name === 'OpenWeatherMap') {
        return {
          data: (response.data as OpenWeatherResponse[]).map(city => ({
            name: city.name,
            country: city.sys.country,
            timezone: '',
            population: 0,
            latitude: city.coord.lat,
            longitude: city.coord.lon,
            offset: 0
          }))
        };
      } else if (provider.name === 'Nominatim') {
        return {
          data: (response.data as NominatimResponse[]).map(city => ({
            name: city.display_name.split(',')[0],
            country: city.display_name.split(',').pop() || '',
            timezone: '',
            population: 0,
            latitude: parseFloat(city.lat),
            longitude: parseFloat(city.lon),
            offset: 0
          }))
        };
      }

      throw new Error(`Unknown provider: ${provider.name}`);
    } catch (error) {
      console.error(`Error fetching from ${provider.name}:`, error);
      throw error;
    }
  }

  private async getCoordinatesForCity(city: string): Promise<{ lat: number; lng: number }> {
    try {
      const provider = this.API_PROVIDERS.find(provider => provider.name === 'GeoDB Cities');
      if (!provider) {
        throw new Error('GeoDB Cities provider not found');
      }

      const response = await axios.get(provider.url, {
        headers: provider.headers,
        params: provider.params(city)
      });

      if (!response.data) {
        throw new Error('No data found');
      }

      const cityData = response.data.data[0];
      return {
        lat: cityData.latitude,
        lng: cityData.longitude
      };
    } catch (error) {
      console.error('Error getting coordinates:', error);
      throw error;
    }
  }

  private async getTimezoneForCoordinates(lat: number, lng: number): Promise<string> {
    try {
      const provider = this.API_PROVIDERS.find(provider => provider.name === 'GeoDB Cities');
      if (!provider) {
        throw new Error('GeoDB Cities provider not found');
      }

      const response = await axios.get(provider.url, {
        headers: provider.headers,
        params: {
          ...provider.params(''),
          lat,
          lng
        }
      });

      if (!response.data) {
        throw new Error('No data found');
      }

      const cityData = response.data.data[0];
      return cityData.timezone;
    } catch (error) {
      console.error('Error getting timezone:', error);
      throw error;
    }
  }

  /**
   * Fetches city data from a single provider.
   * @param provider The provider to fetch from
   * @param query The query to search for
   * @returns A promise resolving to the city data
   */
  async searchCities(query: string): Promise<City[]> {
    try {
      let results: City[] = [];
      let providerError: string | null = null;

      for (const provider of this.API_PROVIDERS) {
        try {
          const providerResults = await this.fetchFromProvider(provider, query);
          const providerCities = providerResults.data.map(city => ({
            ...city,
            id: `${city.name}-${city.country}-${provider.name}`.toLowerCase().replace(/[^a-z0-9]/g, '_'),
            source: provider.name
          }));
          
          // Filter out duplicates based on name and country
          const uniqueCities = providerCities.filter(city => 
            !results.some(existing => 
              existing.name === city.name && 
              existing.country === city.country
            )
          );
          
          results = [...results, ...uniqueCities];
          break;
        } catch (error) {
          providerError = error instanceof Error ? error.message : 'Unknown error';
        }
      }

      if (!results.length && providerError) {
        throw new Error(`No results found. Last error: ${providerError}`);
      }

      // Add timezone information for cities without it
      for (const result of results) {
        if (!result.timezone) {
          try {
            const coordinates = await this.getCoordinatesForCity(result.name);
            result.timezone = await this.getTimezoneForCoordinates(coordinates.lat, coordinates.lng);
          } catch (error) {
            console.error('Error getting timezone for city:', error);
          }
        }
      }

      return results;
    } catch (error) {
      console.error('Error in searchCities:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error: error
      });
      throw new Error('No results found. Last error: Network Error');
    }
  }
}
