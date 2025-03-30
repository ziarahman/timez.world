import { City } from '../../types';

export const mockCities: City[] = [
  {
    city: 'New York',
    country: 'USA',
    timezone: 'America/New_York',
    name: 'New York',
    latitude: 40.7128,
    longitude: -74.0060,
    population: 8419000,
    offset: -5,
  },
  {
    city: 'Los Angeles',
    country: 'USA',
    timezone: 'America/Los_Angeles',
    name: 'Los Angeles',
    latitude: 34.0522,
    longitude: -118.2437,
    population: 3971000,
    offset: -8,
  },
  {
    city: 'London',
    country: 'UK',
    timezone: 'Europe/London',
    name: 'London',
    latitude: 51.5074,
    longitude: -0.1278,
    population: 8982000,
    offset: 0,
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    timezone: 'Asia/Tokyo',
    name: 'Tokyo',
    latitude: 35.6895,
    longitude: 139.6917,
    population: 13929000,
    offset: 9,
  },
  {
    city: 'Sydney',
    country: 'Australia',
    timezone: 'Australia/Sydney',
    name: 'Sydney',
    latitude: -33.8688,
    longitude: 151.2093,
    population: 5230000,
    offset: 10,
  },
];

export const mockTimezones = [
  {
    city: 'New York',
    country: 'United States',
    timezone: 'America/New_York',
    offset: -5,
    isDST: false,
  },
  {
    city: 'London',
    country: 'United Kingdom',
    timezone: 'Europe/London',
    offset: 0,
    isDST: false,
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    timezone: 'Asia/Tokyo',
    offset: 9,
    isDST: false,
  },
];
