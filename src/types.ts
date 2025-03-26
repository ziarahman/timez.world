export interface Timezone {
  id: string;        // IANA timezone ID
  name: string;      // Formatted name
  city: string;      // Primary city name
  country: string;   // Country name
  population: number;// City population
  offset: number;    // Current UTC offset
}

// CityInfo is used internally in the timezone data
export interface CityInfo {
  name: string;
  country: string;
  population: number;
}

export interface TimeSlot {
  hour: number;
  minute: number;
  period: 'AM' | 'PM';
}

/**
 * Generate a consistent unique identifier for a timezone
 * This combines the timezone ID and city name to create a unique key
 * that can be used for identification, comparison, and as a React key
 */
export function getTimezoneUniqueId(timezone: Timezone): string {
  return `${timezone.id}_${timezone.city}`;
}
