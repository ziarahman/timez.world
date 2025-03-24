import { DateTime } from 'luxon'

// Mapping of IANA timezone IDs to major cities and their metadata
interface CityInfo {
  name: string;
  country: string;
  population: number;
}

interface TimezoneCity {
  id: string;        // IANA timezone ID
  name: string;      // Formatted name
  city: string;      // Primary city name
  country: string;   // Country name
  population: number;// City population
  offset: number;    // Current UTC offset
}

// Major cities from GeoNames database, sorted by population
// Indian cities by timezone
const indianCities: Record<string, CityInfo[]> = {
  'Asia/Kolkata': [
    { name: 'Delhi', country: 'India', population: 16787941 },
    { name: 'Mumbai', country: 'India', population: 12442373 },
    { name: 'Bangalore', country: 'India', population: 8443675 },
    { name: 'Hyderabad', country: 'India', population: 6809970 },
    { name: 'Ahmedabad', country: 'India', population: 5570585 },
    { name: 'Chennai', country: 'India', population: 4646732 },
    { name: 'Kolkata', country: 'India', population: 4496694 },
    { name: 'Pune', country: 'India', population: 3124458 },
    { name: 'Surat', country: 'India', population: 4467797 },
    { name: 'Jaipur', country: 'India', population: 3046163 },
    { name: 'Lucknow', country: 'India', population: 2815601 },
    { name: 'Kanpur', country: 'India', population: 2767031 },
    { name: 'Nagpur', country: 'India', population: 2405665 },
    { name: 'Indore', country: 'India', population: 1994397 },
    { name: 'Thane', country: 'India', population: 1841488 },
    { name: 'Bhopal', country: 'India', population: 1798218 },
    { name: 'Visakhapatnam', country: 'India', population: 1728128 },
    { name: 'Noida', country: 'India', population: 642381 },
    { name: 'Gurgaon', country: 'India', population: 876824 },
  ],
}

// US cities by timezone
const usCities: Record<string, CityInfo[]> = {
  'America/Los_Angeles': [
    { name: 'Los Angeles', country: 'United States', population: 3990456 },
    { name: 'San Francisco', country: 'United States', population: 873965 },
    { name: 'San Diego', country: 'United States', population: 1423851 },
    { name: 'Seattle', country: 'United States', population: 737015 },
    { name: 'Portland', country: 'United States', population: 652503 },
    { name: 'San Jose', country: 'United States', population: 1021795 },
    { name: 'Sacramento', country: 'United States', population: 513624 },
    { name: 'Las Vegas', country: 'United States', population: 641903 },
    { name: 'San Mateo', country: 'United States', population: 104430 },
    { name: 'Foster City', country: 'United States', population: 33805 },
  ],
  'America/Chicago': [
    { name: 'Chicago', country: 'United States', population: 2746388 },
    { name: 'Houston', country: 'United States', population: 2320268 },
    { name: 'Dallas', country: 'United States', population: 1330612 },
    { name: 'San Antonio', country: 'United States', population: 1547253 },
    { name: 'Austin', country: 'United States', population: 961855 },
    { name: 'Fort Worth', country: 'United States', population: 909585 },
    { name: 'Minneapolis', country: 'United States', population: 429954 },
    { name: 'Kansas City', country: 'United States', population: 495327 },
    { name: 'New Orleans', country: 'United States', population: 383997 },
  ],
  'America/New_York': [
    { name: 'New York', country: 'United States', population: 8419000 },
    { name: 'Washington DC', country: 'United States', population: 689545 },
    { name: 'Boston', country: 'United States', population: 675647 },
    { name: 'Atlanta', country: 'United States', population: 498715 },
    { name: 'Miami', country: 'United States', population: 442241 },
    { name: 'Philadelphia', country: 'United States', population: 1603797 },
    { name: 'Charlotte', country: 'United States', population: 872498 },
    { name: 'Ashburn', country: 'United States', population: 43511 },
    { name: 'Raleigh', country: 'United States', population: 467665 },
    { name: 'Orlando', country: 'United States', population: 287442 },
    { name: 'Pittsburgh', country: 'United States', population: 302971 },
  ],
  'America/Phoenix': [
    { name: 'Phoenix', country: 'United States', population: 1608139 },
    { name: 'Tucson', country: 'United States', population: 542629 },
    { name: 'Mesa', country: 'United States', population: 508958 },
    { name: 'Scottsdale', country: 'United States', population: 241361 },
  ],
  'America/Denver': [
    { name: 'Denver', country: 'United States', population: 727211 },
    { name: 'Salt Lake City', country: 'United States', population: 199723 },
    { name: 'Albuquerque', country: 'United States', population: 564559 },
    { name: 'Colorado Springs', country: 'United States', population: 478961 },
    { name: 'Boulder', country: 'United States', population: 105673 },
  ],
}

// South Asian cities by timezone
const southAsianCities: Record<string, CityInfo[]> = {
  'Asia/Dhaka': [
    { name: 'Dhaka', country: 'Bangladesh', population: 8906039 },
    { name: 'Chittagong', country: 'Bangladesh', population: 2581643 },
  ],
  'Asia/Kathmandu': [
    { name: 'Kathmandu', country: 'Nepal', population: 1442271 },
    { name: 'Pokhara', country: 'Nepal', population: 200000 },
  ],
  'Asia/Colombo': [
    { name: 'Colombo', country: 'Sri Lanka', population: 752993 },
    { name: 'Kandy', country: 'Sri Lanka', population: 111701 },
  ],
  'Asia/Thimphu': [
    { name: 'Thimphu', country: 'Bhutan', population: 114551 },
  ],
  'Asia/Kabul': [
    { name: 'Kabul', country: 'Afghanistan', population: 4601789 },
    { name: 'Kandahar', country: 'Afghanistan', population: 491500 },
  ],
}

// Global cities
const globalCities: Record<string, CityInfo> = {
  'Asia/Shanghai': { name: 'Shanghai', country: 'China', population: 24870895 },
  'Asia/Beijing': { name: 'Beijing', country: 'China', population: 20462610 },
  'Asia/Shenzhen': { name: 'Shenzhen', country: 'China', population: 17494398 },
  'Asia/Guangzhou': { name: 'Guangzhou', country: 'China', population: 16096724 },
  'Asia/Karachi': { name: 'Karachi', country: 'Pakistan', population: 14910352 },
  'Asia/Istanbul': { name: 'Istanbul', country: 'Turkey', population: 14804116 },
  'America/Sao_Paulo': { name: 'São Paulo', country: 'Brazil', population: 12252023 },
  'Asia/Tokyo': { name: 'Tokyo', country: 'Japan', population: 9272740 },
  'Asia/Hong_Kong': { name: 'Hong Kong', country: 'China', population: 7448900 },
  'Asia/Singapore': { name: 'Singapore', country: 'Singapore', population: 5850342 },
  'Asia/Osaka': { name: 'Osaka', country: 'Japan', population: 2691742 },
  'Asia/Seoul': { name: 'Seoul', country: 'South Korea', population: 9776000 },
  'Asia/Jakarta': { name: 'Jakarta', country: 'Indonesia', population: 10562088 },
  'Asia/Bangkok': { name: 'Bangkok', country: 'Thailand', population: 8280925 },
  'Asia/Manila': { name: 'Manila', country: 'Philippines', population: 1780148 },
  'Asia/Kuala_Lumpur': { name: 'Kuala Lumpur', country: 'Malaysia', population: 1790000 },
  'Asia/Taipei': { name: 'Taipei', country: 'Taiwan', population: 2674652 },
  'Asia/Ho_Chi_Minh': { name: 'Ho Chi Minh City', country: 'Vietnam', population: 8993082 },
  'Asia/Hanoi': { name: 'Hanoi', country: 'Vietnam', population: 7785000 },
  'Europe/London': { name: 'London', country: 'United Kingdom', population: 8908081 },
  'Europe/Manchester': { name: 'Manchester', country: 'United Kingdom', population: 2705000 },
  'Europe/Paris': { name: 'Paris', country: 'France', population: 2148271 },
  'Europe/Berlin': { name: 'Berlin', country: 'Germany', population: 3669495 },
  'Europe/Munich': { name: 'Munich', country: 'Germany', population: 1472000 },
  'Europe/Moscow': { name: 'Moscow', country: 'Russia', population: 12506468 },
  'Europe/Saint_Petersburg': { name: 'Saint Petersburg', country: 'Russia', population: 5351935 },
  'Australia/Sydney': { name: 'Sydney', country: 'Australia', population: 5367206 },
  'Australia/Melbourne': { name: 'Melbourne', country: 'Australia', population: 5078193 },
  'Australia/Brisbane': { name: 'Brisbane', country: 'Australia', population: 2560720 },
  'Pacific/Auckland': { name: 'Auckland', country: 'New Zealand', population: 1657200 },
  'Asia/Dubai': { name: 'Dubai', country: 'United Arab Emirates', population: 3331420 },
  'Asia/Abu_Dhabi': { name: 'Abu Dhabi', country: 'United Arab Emirates', population: 1480000 },
  'Asia/Busan': { name: 'Busan', country: 'South Korea', population: 3359527 },
  'Asia/Surabaya': { name: 'Surabaya', country: 'Indonesia', population: 2874699 },
  'Asia/Cebu': { name: 'Cebu', country: 'Philippines', population: 922611 },
  'Africa/Cairo': { name: 'Cairo', country: 'Egypt', population: 9539000 },
  'Africa/Alexandria': { name: 'Alexandria', country: 'Egypt', population: 5200000 },
  'Africa/Lagos': { name: 'Lagos', country: 'Nigeria', population: 14862111 },
  'Africa/Nairobi': { name: 'Nairobi', country: 'Kenya', population: 4397073 },
  'Africa/Johannesburg': { name: 'Johannesburg', country: 'South Africa', population: 5782747 },
  'Africa/Cape_Town': { name: 'Cape Town', country: 'South Africa', population: 4618000 },
  'Europe/Amsterdam': { name: 'Amsterdam', country: 'Netherlands', population: 872680 },
  'Europe/Rome': { name: 'Rome', country: 'Italy', population: 4342212 },
  'Europe/Milan': { name: 'Milan', country: 'Italy', population: 1352000 },
  'Europe/Madrid': { name: 'Madrid', country: 'Spain', population: 3223334 },
  'Europe/Barcelona': { name: 'Barcelona', country: 'Spain', population: 1620000 },
  'Europe/Vienna': { name: 'Vienna', country: 'Austria', population: 1897491 },
  'Europe/Stockholm': { name: 'Stockholm', country: 'Sweden', population: 975551 },
  'Europe/Warsaw': { name: 'Warsaw', country: 'Poland', population: 1783321 },
  'America/Mexico_City': { name: 'Mexico City', country: 'Mexico', population: 9209944 },
  'America/Guadalajara': { name: 'Guadalajara', country: 'Mexico', population: 1495182 },
  'America/Bogota': { name: 'Bogotá', country: 'Colombia', population: 7674366 },
  'America/Lima': { name: 'Lima', country: 'Peru', population: 8852000 },
  'America/Santiago': { name: 'Santiago', country: 'Chile', population: 6724310 }
}

// Get all available timezones with their current offsets
export function getAvailableTimezones(): TimezoneCity[] {
  const allCities: TimezoneCity[] = []
  const seenTimezones = new Set<string>()

  // Helper function to add a city to the list
  const addCity = (id: string, info: CityInfo) => {
    const now = DateTime.now()
    const zoned = now.setZone(id)
    allCities.push({
      id,
      name: `${info.country}/${info.name}`,
      city: info.name,
      country: info.country,
      population: info.population,
      offset: zoned.offset
    })
    seenTimezones.add(id)
  }

  // Add all global cities
  Object.entries(globalCities).forEach(([id, info]) => {
    if (!seenTimezones.has(id)) {
      addCity(id, info)
    }
  })

  // Add all Indian cities
  Object.entries(indianCities).forEach(([timezone, cities]) => {
    cities.forEach(city => {
      addCity(timezone, city)
    })
  })

  // Add all South Asian cities
  Object.entries(southAsianCities).forEach(([timezone, cities]) => {
    cities.forEach(city => {
      addCity(timezone, city)
    })
  })

  // Add all US cities
  Object.entries(usCities).forEach(([timezone, cities]) => {
    cities.forEach(city => {
      addCity(timezone, city)
    })
  })

  // Sort by population
  return allCities.sort((a, b) => b.population - a.population)
}

// Format the timezone name with city and offset
export function formatTimezoneName(timezone: TimezoneCity): string {
  const offsetHours = Math.floor(Math.abs(timezone.offset) / 60)
  const offsetMinutes = Math.abs(timezone.offset) % 60
  const offsetSign = timezone.offset >= 0 ? '+' : '-'
  const offsetString = `${offsetSign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`
  return `${timezone.country}/${timezone.city} (UTC${offsetString})`
}
