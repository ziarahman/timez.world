import { DateTime } from 'luxon'
import { Timezone, CityInfo } from '../types'

// Major cities from GeoNames database, sorted by population
// Indian cities by timezone
const indianCities: Record<string, CityInfo[]> = {
  'Asia/Kolkata': [
    { name: 'Delhi', country: 'India', population: 34700000 },
    { name: 'Mumbai', country: 'India', population: 22100000 },
    { name: 'Kolkata', country: 'India', population: 15200000 },
    { name: 'Bangalore', country: 'India', population: 13200000 },
    { name: 'Chennai', country: 'India', population: 11500000 },
    { name: 'Hyderabad', country: 'India', population: 10100000 },
    { name: 'Ahmedabad', country: 'India', population: 8400000 },
    { name: 'Pune', country: 'India', population: 7400000 },
    { name: 'Surat', country: 'India', population: 6900000 },
    { name: 'Jaipur', country: 'India', population: 4100000 },
    { name: 'Lucknow', country: 'India', population: 3700000 },
    { name: 'Kanpur', country: 'India', population: 3400000 },
    { name: 'Nagpur', country: 'India', population: 3300000 },
    { name: 'Indore', country: 'India', population: 2900000 },
    { name: 'Thane', country: 'India', population: 2400000 },
    { name: 'Bhopal', country: 'India', population: 2300000 },
    { name: 'Visakhapatnam', country: 'India', population: 2200000 },
    { name: 'Pimpri-Chinchwad', country: 'India', population: 2100000 },
    { name: 'Patna', country: 'India', population: 2100000 },
    { name: 'Vadodara', country: 'India', population: 2100000 },
    { name: 'Ghaziabad', country: 'India', population: 1900000 },
    { name: 'Ludhiana', country: 'India', population: 1800000 },
    { name: 'Agra', country: 'India', population: 1800000 },
    { name: 'Nashik', country: 'India', population: 1700000 },
    { name: 'Faridabad', country: 'India', population: 1600000 },
    { name: 'Meerut', country: 'India', population: 1600000 },
    { name: 'Rajkot', country: 'India', population: 1600000 },
    { name: 'Kalyan-Dombivali', country: 'India', population: 1500000 },
    { name: 'Vasai-Virar', country: 'India', population: 1500000 },
    { name: 'Varanasi', country: 'India', population: 1500000 }
  ],
}

// US cities by timezone
const usCities: Record<string, CityInfo[]> = {
  'America/New_York': [
    { name: 'New York', country: 'United States', population: 18800000 },
    { name: 'Washington DC', country: 'United States', population: 6400000 },
    { name: 'Philadelphia', country: 'United States', population: 6200000 },
    { name: 'Boston', country: 'United States', population: 4900000 },
    { name: 'Atlanta', country: 'United States', population: 6100000 },
    { name: 'Miami', country: 'United States', population: 6300000 },
    { name: 'Tampa', country: 'United States', population: 3200000 },
    { name: 'Baltimore', country: 'United States', population: 2800000 },
    { name: 'Charlotte', country: 'United States', population: 2700000 },
    { name: 'Orlando', country: 'United States', population: 2600000 },
    { name: 'Pittsburgh', country: 'United States', population: 2300000 },
    { name: 'Jacksonville', country: 'United States', population: 1600000 },
    { name: 'Buffalo', country: 'United States', population: 1100000 },
    { name: 'Ashburn', country: 'United States', population: 43629 },
    { name: 'Raleigh', country: 'United States', population: 469124 },
    { name: 'Richmond', country: 'United States', population: 226610 },
  ],
  'America/Chicago': [
    { name: 'Chicago', country: 'United States', population: 8900000 },
    { name: 'Houston', country: 'United States', population: 7100000 },
    { name: 'Dallas', country: 'United States', population: 7600000 },
    { name: 'Minneapolis', country: 'United States', population: 3700000 },
    { name: 'San Antonio', country: 'United States', population: 2600000 },
    { name: 'Austin', country: 'United States', population: 2300000 },
    { name: 'Kansas City', country: 'United States', population: 2200000 },
    { name: 'Milwaukee', country: 'United States', population: 1600000 },
    { name: 'New Orleans', country: 'United States', population: 1300000 },
    { name: 'Memphis', country: 'United States', population: 1300000 },
    { name: 'Oklahoma City', country: 'United States', population: 1400000 },
  ],
  'America/Los_Angeles': [
    { name: 'Los Angeles', country: 'United States', population: 12500000 },
    { name: 'San Francisco', country: 'United States', population: 4700000 },
    { name: 'Seattle', country: 'United States', population: 4000000 },
    { name: 'San Diego', country: 'United States', population: 3300000 },
    { name: 'Portland', country: 'United States', population: 2500000 },
    { name: 'Sacramento', country: 'United States', population: 2300000 },
    { name: 'Las Vegas', country: 'United States', population: 2300000 },
    { name: 'San Jose', country: 'United States', population: 2000000 },
    { name: 'Mountain View', country: 'United States', population: 82739 },
    { name: 'Palo Alto', country: 'United States', population: 65364 },
  ],
  'America/Phoenix': [
    { name: 'Phoenix', country: 'United States', population: 4900000 },
    { name: 'Tucson', country: 'United States', population: 1100000 },
    { name: 'Mesa', country: 'United States', population: 500000 },
  ],
  'America/Denver': [
    { name: 'Denver', country: 'United States', population: 2900000 },
    { name: 'Salt Lake City', country: 'United States', population: 1200000 },
    { name: 'Albuquerque', country: 'United States', population: 900000 },
    { name: 'Colorado Springs', country: 'United States', population: 700000 },
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
// Canadian cities by timezone
const canadianCities: Record<string, CityInfo[]> = {
  'America/Toronto': [
    { name: 'Toronto', country: 'Canada', population: 2731571 },
    { name: 'Ottawa', country: 'Canada', population: 934243 },
    { name: 'Montreal', country: 'Canada', population: 1704694 },
  ],
  'America/Vancouver': [
    { name: 'Vancouver', country: 'Canada', population: 631486 },
    { name: 'Victoria', country: 'Canada', population: 92141 },
  ],
  'America/Edmonton': [
    { name: 'Edmonton', country: 'Canada', population: 932546 },
    { name: 'Calgary', country: 'Canada', population: 1239220 },
  ],
  'America/Winnipeg': [
    { name: 'Winnipeg', country: 'Canada', population: 749607 },
  ],
  'America/Halifax': [
    { name: 'Halifax', country: 'Canada', population: 403131 },
  ],
}

// European cities by timezone
const europeanCities: Record<string, CityInfo[]> = {
  'Europe/Dublin': [
    { name: 'Dublin', country: 'Ireland', population: 1173179 },
    { name: 'Cork', country: 'Ireland', population: 190384 },
  ],
  'Europe/Brussels': [
    { name: 'Brussels', country: 'Belgium', population: 1191604 },
    { name: 'Antwerp', country: 'Belgium', population: 523248 },
  ],
  'Europe/Copenhagen': [
    { name: 'Copenhagen', country: 'Denmark', population: 1295686 },
    { name: 'Aarhus', country: 'Denmark', population: 349983 },
  ],
  'Europe/Oslo': [
    { name: 'Oslo', country: 'Norway', population: 693494 },
    { name: 'Bergen', country: 'Norway', population: 283929 },
  ],
  'Europe/Zurich': [
    { name: 'Zurich', country: 'Switzerland', population: 402762 },
    { name: 'Geneva', country: 'Switzerland', population: 201818 },
  ],
  'Europe/Lisbon': [
    { name: 'Lisbon', country: 'Portugal', population: 504718 },
    { name: 'Porto', country: 'Portugal', population: 214349 },
  ],
  'Europe/Warsaw': [
    { name: 'Warsaw', country: 'Poland', population: 1790658 },
    { name: 'Krakow', country: 'Poland', population: 780000 },
  ],
  'Europe/Prague': [
    { name: 'Prague', country: 'Czech Republic', population: 1309000 },
    { name: 'Brno', country: 'Czech Republic', population: 379526 },
  ],
  'Europe/Vienna': [
    { name: 'Vienna', country: 'Austria', population: 1897491 },
    { name: 'Salzburg', country: 'Austria', population: 155021 },
  ],
  'Europe/Budapest': [
    { name: 'Budapest', country: 'Hungary', population: 1752286 },
    { name: 'Debrecen', country: 'Hungary', population: 203506 },
  ],
}

// Middle Eastern cities by timezone
const middleEastCities: Record<string, CityInfo[]> = {
  'Asia/Dubai': [
    { name: 'Ajman', country: 'UAE', population: 504846 },
    { name: 'Ras Al Khaimah', country: 'UAE', population: 345000 },
    { name: 'Fujairah', country: 'UAE', population: 192190 },
    { name: 'Umm Al Quwain', country: 'UAE', population: 73000 },
    { name: 'Abu Dhabi', country: 'UAE', population: 1450000 },
    { name: 'Sharjah', country: 'UAE', population: 1274749 },
  ],
  'Asia/Riyadh': [
    { name: 'Jeddah', country: 'Saudi Arabia', population: 4076000 },
    { name: 'Mecca', country: 'Saudi Arabia', population: 1919900 },
    { name: 'Medina', country: 'Saudi Arabia', population: 1300000 },
    { name: 'Dammam', country: 'Saudi Arabia', population: 1000000 },
    { name: 'Kuwait City', country: 'Kuwait', population: 2380000 }, // Kuwait uses Asia/Riyadh timezone
  ],
  'Asia/Jerusalem': [
    { name: 'Jerusalem', country: 'Israel', population: 936425 },
    { name: 'Tel Aviv', country: 'Israel', population: 460613 },
    { name: 'Haifa', country: 'Israel', population: 285316 },
  ],
  'Asia/Baghdad': [
    { name: 'Basra', country: 'Iraq', population: 2750000 },
    { name: 'Mosul', country: 'Iraq', population: 1740000 },
  ],
  'Asia/Qatar': [
    { name: 'Doha', country: 'Qatar', population: 1450000 },
  ],
  'Asia/Muscat': [
    { name: 'Muscat', country: 'Oman', population: 1720000 },
  ],
  // Kuwait City is already included in the Asia/Riyadh group above
  'Asia/Amman': [
    { name: 'Amman', country: 'Jordan', population: 4007526 },
  ],
  'Asia/Beirut': [
    { name: 'Beirut', country: 'Lebanon', population: 2200000 },
  ],
}

// Australian cities by timezone
const australianCities: Record<string, CityInfo[]> = {
  'Australia/Sydney': [
    { name: 'Newcastle', country: 'Australia', population: 322278 },
    { name: 'Wollongong', country: 'Australia', population: 302739 },
    { name: 'Central Coast', country: 'Australia', population: 333627 },
  ],
  'Australia/Melbourne': [
    { name: 'Geelong', country: 'Australia', population: 196393 },
    { name: 'Ballarat', country: 'Australia', population: 105471 },
    { name: 'Bendigo', country: 'Australia', population: 99122 },
  ],
  'Australia/Brisbane': [
    { name: 'Gold Coast', country: 'Australia', population: 679127 },
    { name: 'Sunshine Coast', country: 'Australia', population: 333436 },
    { name: 'Townsville', country: 'Australia', population: 180820 },
    { name: 'Cairns', country: 'Australia', population: 152729 },
  ],
  'Australia/Perth': [
    { name: 'Bunbury', country: 'Australia', population: 74363 },
    { name: 'Geraldton', country: 'Australia', population: 37648 },
  ],
  'Australia/Adelaide': [
    { name: 'Mount Gambier', country: 'Australia', population: 29639 },
    { name: 'Whyalla', country: 'Australia', population: 21751 },
  ],
}

// South American cities by timezone
const southAmericanCities: Record<string, CityInfo[]> = {
  'America/Rio_de_Janeiro': [
    { name: 'Rio de Janeiro', country: 'Brazil', population: 6747815 },
    { name: 'Belo Horizonte', country: 'Brazil', population: 2521564 },
  ],
  'America/Buenos_Aires': [
    { name: 'Buenos Aires', country: 'Argentina', population: 2891082 },
    { name: 'Córdoba', country: 'Argentina', population: 1430554 },
  ],
  'America/Santiago': [
    { name: 'Santiago', country: 'Chile', population: 6158080 },
    { name: 'Valparaíso', country: 'Chile', population: 284630 },
  ],
  'America/Lima': [
    { name: 'Lima', country: 'Peru', population: 8852000 },
    { name: 'Arequipa', country: 'Peru', population: 1008290 },
  ],
  'America/Bogota': [
    { name: 'Bogotá', country: 'Colombia', population: 7181469 },
    { name: 'Medellín', country: 'Colombia', population: 2529403 },
  ],
}

// All major Chinese cities use Asia/Shanghai timezone
const chinaCities: CityInfo[] = [
  { name: 'Shanghai', country: 'China', population: 30500000 },
  { name: 'Beijing', country: 'China', population: 22600000 },
  { name: 'Guangzhou', country: 'China', population: 19000000 },
  { name: 'Shenzhen', country: 'China', population: 17494398 },
  { name: 'Chongqing', country: 'China', population: 16875000 },
  { name: 'Tianjin', country: 'China', population: 15200000 },
  { name: 'Chengdu', country: 'China', population: 16311600 },
  { name: 'Wuhan', country: 'China', population: 11081000 },
  { name: 'Hangzhou', country: 'China', population: 10360000 },
  { name: 'Xi\'an', country: 'China', population: 9600000 },
  { name: 'Zhengzhou', country: 'China', population: 9000000 },
  { name: 'Shenyang', country: 'China', population: 8500000 },
  { name: 'Nanjing', country: 'China', population: 8400000 },
  { name: 'Qingdao', country: 'China', population: 7700000 },
  { name: 'Changsha', country: 'China', population: 7500000 },
  { name: 'Kunming', country: 'China', population: 7200000 },
  { name: 'Dalian', country: 'China', population: 6700000 },
  { name: 'Xiamen', country: 'China', population: 5200000 },
  { name: 'Suzhou', country: 'China', population: 5000000 },
  { name: 'Ningbo', country: 'China', population: 4900000 }
];

const globalCities: Record<string, CityInfo> = {
  // East Asia
  // China (all cities use Asia/Shanghai timezone)
  'Asia/Shanghai': { name: 'Shanghai', country: 'China', population: 30500000 },
  
  // Japan
  'Asia/Tokyo': { name: 'Tokyo', country: 'Japan', population: 37000000 },
  'Asia/Osaka': { name: 'Osaka', country: 'Japan', population: 18900000 },
  'Asia/Nagoya': { name: 'Nagoya', country: 'Japan', population: 9507835 },
  'Asia/Fukuoka': { name: 'Fukuoka', country: 'Japan', population: 5538142 },
  'Asia/Sapporo': { name: 'Sapporo', country: 'Japan', population: 1973832 },
  
  // South Korea
  'Asia/Seoul': { name: 'Seoul', country: 'South Korea', population: 9900000 },
  'Asia/Busan': { name: 'Busan', country: 'South Korea', population: 3400000 },
  
  // South Asia
  'Asia/Kolkata': { name: 'Delhi', country: 'India', population: 34700000 },
  'Asia/Karachi': { name: 'Karachi', country: 'Pakistan', population: 16800000 },
  'Asia/Dhaka': { name: 'Dhaka', country: 'Bangladesh', population: 22500000 },
  
  // Southeast Asia
  'Asia/Jakarta': { name: 'Jakarta', country: 'Indonesia', population: 33430000 },
  'Asia/Manila': { name: 'Manila', country: 'Philippines', population: 24300000 },
  'Asia/Bangkok': { name: 'Bangkok', country: 'Thailand', population: 17066000 },
  'Asia/Ho_Chi_Minh': { name: 'Ho Chi Minh City', country: 'Vietnam', population: 13500000 },
  'Asia/Singapore': { name: 'Singapore', country: 'Singapore', population: 5850342 },
  'Asia/Hanoi': { name: 'Hanoi', country: 'Vietnam', population: 8100000 },
  'Asia/Kuala_Lumpur': { name: 'Kuala Lumpur', country: 'Malaysia', population: 7900000 },
  
  // Middle East
  'Asia/Cairo': { name: 'Cairo', country: 'Egypt', population: 23100000 },
  'Asia/Istanbul': { name: 'Istanbul', country: 'Turkey', population: 16200000 },
  'Asia/Tehran': { name: 'Tehran', country: 'Iran', population: 13600000 },
  'Asia/Riyadh': { name: 'Riyadh', country: 'Saudi Arabia', population: 7600000 },
  'Asia/Baghdad': { name: 'Baghdad', country: 'Iraq', population: 7511000 },
  'Asia/Dubai': { name: 'Dubai', country: 'UAE', population: 3500000 },
  // Note: Abu Dhabi and Sharjah use the same timezone as Dubai (Asia/Dubai)
  // We'll add them to the middleEastCities collection instead to avoid duplicate keys
  // Using standard IANA timezone identifiers
  'Asia/Qatar': { name: 'Doha', country: 'Qatar', population: 1450000 },
  'Asia/Muscat': { name: 'Muscat', country: 'Oman', population: 1720000 },
  // Kuwait City is added to the middleEastCities collection under Asia/Riyadh
  'Asia/Amman': { name: 'Amman', country: 'Jordan', population: 4007526 },
  'Asia/Beirut': { name: 'Beirut', country: 'Lebanon', population: 2200000 },
  
  // Africa
  'Africa/Lagos': { name: 'Lagos', country: 'Nigeria', population: 21000000 },
  'Africa/Kinshasa': { name: 'Kinshasa', country: 'DR Congo', population: 15500000 },
  'Africa/Johannesburg': { name: 'Johannesburg', country: 'South Africa', population: 6200000 },
  'Africa/Nairobi': { name: 'Nairobi', country: 'Kenya', population: 5400000 },
  'Africa/Addis_Ababa': { name: 'Addis Ababa', country: 'Ethiopia', population: 4800000 },
  
  // Europe
  'Europe/Moscow': { name: 'Moscow', country: 'Russia', population: 12700000 },
  'Europe/Paris': { name: 'Paris', country: 'France', population: 11300000 },
  'Europe/London': { name: 'London', country: 'UK', population: 9500000 },
  'Europe/Madrid': { name: 'Madrid', country: 'Spain', population: 6700000 },
  'Europe/Rome': { name: 'Rome', country: 'Italy', population: 4400000 },
  'Europe/Berlin': { name: 'Berlin', country: 'Germany', population: 3700000 },
  'Europe/Warsaw': { name: 'Warsaw', country: 'Poland', population: 1790658 },
  'Europe/Amsterdam': { name: 'Amsterdam', country: 'Netherlands', population: 1149000 },
  'Europe/Athens': { name: 'Athens', country: 'Greece', population: 3153000 },
  'Europe/Stockholm': { name: 'Stockholm', country: 'Sweden', population: 1632798 },
  
  // Australia & Pacific
  'Australia/Sydney': { name: 'Sydney', country: 'Australia', population: 5400000 },
  'Australia/Melbourne': { name: 'Melbourne', country: 'Australia', population: 5080000 },
  'Australia/Brisbane': { name: 'Brisbane', country: 'Australia', population: 2560000 },
  'Australia/Perth': { name: 'Perth', country: 'Australia', population: 2100000 },
  'Australia/Adelaide': { name: 'Adelaide', country: 'Australia', population: 1376601 },
  'Australia/Canberra': { name: 'Canberra', country: 'Australia', population: 431380 },
  'Australia/Hobart': { name: 'Hobart', country: 'Australia', population: 240342 },
  'Australia/Darwin': { name: 'Darwin', country: 'Australia', population: 147255 },
  'Pacific/Auckland': { name: 'Auckland', country: 'New Zealand', population: 1660000 },
  'Pacific/Wellington': { name: 'Wellington', country: 'New Zealand', population: 412500 },
  'Pacific/Fiji': { name: 'Suva', country: 'Fiji', population: 93970 },
  
  // Americas
  // North America
  'America/Mexico_City': { name: 'Mexico City', country: 'Mexico', population: 22800000 },
  'America/New_York': { name: 'New York', country: 'United States', population: 18800000 },
  'America/Los_Angeles': { name: 'Los Angeles', country: 'United States', population: 12500000 },
  'America/Chicago': { name: 'Chicago', country: 'United States', population: 8900000 },
  'America/Toronto': { name: 'Toronto', country: 'Canada', population: 6900000 },
  'America/Houston': { name: 'Houston', country: 'United States', population: 6600000 },
  'America/Phoenix': { name: 'Phoenix', country: 'United States', population: 4900000 },
  'America/Vancouver': { name: 'Vancouver', country: 'Canada', population: 2500000 },
  
  // South America
  'America/Sao_Paulo': { name: 'São Paulo', country: 'Brazil', population: 22400000 },
  'America/Lima': { name: 'Lima', country: 'Peru', population: 11000000 },
  'America/Bogota': { name: 'Bogotá', country: 'Colombia', population: 10900000 },
  'America/Rio_de_Janeiro': { name: 'Rio de Janeiro', country: 'Brazil', population: 13500000 },
  'America/Santiago': { name: 'Santiago', country: 'Chile', population: 6900000 },
  'America/Buenos_Aires': { name: 'Buenos Aires', country: 'Argentina', population: 15800000 },
  'America/Caracas': { name: 'Caracas', country: 'Venezuela', population: 3000000 },

  // Additional African cities
  'Africa/Casablanca': { name: 'Casablanca', country: 'Morocco', population: 3359818 },
  'America/Guadalajara': { name: 'Guadalajara', country: 'Mexico', population: 1495182 }
}

// Get all available timezones with their current offsets
export function getAvailableTimezones(): Timezone[] {
  const allCities: Timezone[] = []
  const seenTimezones = new Set<string>()
  // Track unique city-timezone combinations to avoid duplicates
  const seenCityTimezones = new Set<string>()

  // Helper function to add a city to the list
  const addCity = (id: string, info: CityInfo) => {
    const now = DateTime.now()
    const zoned = now.setZone(id)
    if (!zoned.isValid) {
      console.error(`Invalid timezone: ${id}`, zoned.invalidReason)
      return
    }
    
    // Create a unique key for this city-timezone combination
    const cityTimezoneKey = `${info.name}-${info.country}-${id}`
    
    // Skip if we've already added this city with this timezone
    if (seenCityTimezones.has(cityTimezoneKey)) {
      return
    }
    
    allCities.push({
      id,
      name: `${info.country}/${info.name}`,
      city: info.name,
      country: info.country,
      population: info.population,
      offset: zoned.offset
    })
    seenTimezones.add(id)
    seenCityTimezones.add(cityTimezoneKey)
  }

  // Add Chinese cities (all using Asia/Shanghai timezone)
  chinaCities.forEach(city => {
    addCity('Asia/Shanghai', city)
  })

  // Add all other global cities
  Object.entries(globalCities).forEach(([id, info]) => {
    if (!seenTimezones.has(id)) {
      addCity(id, info)
    }
  })

  // Add all Canadian cities
  Object.entries(canadianCities).forEach(([timezone, cities]) => {
    cities.forEach(city => {
      addCity(timezone, city)
    })
  })

  // Add all European cities
  Object.entries(europeanCities).forEach(([timezone, cities]) => {
    cities.forEach(city => {
      addCity(timezone, city)
    })
  })

  // Add all South American cities
  Object.entries(southAmericanCities).forEach(([timezone, cities]) => {
    cities.forEach(city => {
      addCity(timezone, city)
    })
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

  // Add all Middle Eastern cities
  Object.entries(middleEastCities).forEach(([timezone, cities]) => {
    cities.forEach(city => {
      addCity(timezone, city)
    })
  })

  // Add all Australian cities
  Object.entries(australianCities).forEach(([timezone, cities]) => {
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
export function formatTimezoneName(timezone: Timezone): string {
  if (typeof timezone.offset !== 'number' || isNaN(timezone.offset)) {
    console.error('Invalid offset for timezone:', timezone)
    return `${timezone.country}/${timezone.city}`
  }
  const offsetHours = Math.floor(Math.abs(timezone.offset) / 60)
  const offsetMinutes = Math.abs(timezone.offset) % 60
  const offsetSign = timezone.offset >= 0 ? '+' : '-'
  const offsetString = `${offsetSign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`
  return `${timezone.country}/${timezone.city} (UTC${offsetString})`
}
