import { CityInfo } from '../types'

// Interface for city information with timezone property
interface CityInfoWithTimezone extends CityInfo {
  timezone: string; // Valid IANA timezone identifier
}

// Interface for Timezone
interface Timezone {
  id: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
  latitude: number;
  longitude: number;
  population: number;
  offset: number;
}

// Major cities from GeoNames database, sorted by population
// Indian cities by timezone
const indianCities: Record<string, CityInfoWithTimezone[]> = {
  'Asia/Kolkata': [
    { name: 'Delhi', country: 'India', population: 34700000, timezone: 'Asia/Kolkata' },
    { name: 'Mumbai', country: 'India', population: 22100000, timezone: 'Asia/Kolkata' },
    { name: 'Kolkata', country: 'India', population: 15200000, timezone: 'Asia/Kolkata' },
    { name: 'Bangalore', country: 'India', population: 13200000, timezone: 'Asia/Kolkata' },
    { name: 'Chennai', country: 'India', population: 11500000, timezone: 'Asia/Kolkata' },
    { name: 'Hyderabad', country: 'India', population: 10100000, timezone: 'Asia/Kolkata' },
    { name: 'Ahmedabad', country: 'India', population: 8400000, timezone: 'Asia/Kolkata' },
    { name: 'Pune', country: 'India', population: 7400000, timezone: 'Asia/Kolkata' },
    { name: 'Surat', country: 'India', population: 6900000, timezone: 'Asia/Kolkata' },
    { name: 'Jaipur', country: 'India', population: 4100000, timezone: 'Asia/Kolkata' },
    { name: 'Lucknow', country: 'India', population: 3700000, timezone: 'Asia/Kolkata' },
    { name: 'Kanpur', country: 'India', population: 3400000, timezone: 'Asia/Kolkata' },
    { name: 'Nagpur', country: 'India', population: 3300000, timezone: 'Asia/Kolkata' },
    { name: 'Indore', country: 'India', population: 2900000, timezone: 'Asia/Kolkata' },
    { name: 'Thane', country: 'India', population: 2400000, timezone: 'Asia/Kolkata' },
    { name: 'Bhopal', country: 'India', population: 2300000, timezone: 'Asia/Kolkata' },
    { name: 'Visakhapatnam', country: 'India', population: 2200000, timezone: 'Asia/Kolkata' },
    { name: 'Pimpri-Chinchwad', country: 'India', population: 2100000, timezone: 'Asia/Kolkata' },
    { name: 'Patna', country: 'India', population: 2100000, timezone: 'Asia/Kolkata' },
    { name: 'Vadodara', country: 'India', population: 2100000, timezone: 'Asia/Kolkata' },
    { name: 'Ghaziabad', country: 'India', population: 1900000, timezone: 'Asia/Kolkata' },
    { name: 'Ludhiana', country: 'India', population: 1800000, timezone: 'Asia/Kolkata' },
    { name: 'Agra', country: 'India', population: 1800000, timezone: 'Asia/Kolkata' },
    { name: 'Nashik', country: 'India', population: 1700000, timezone: 'Asia/Kolkata' },
    { name: 'Faridabad', country: 'India', population: 1600000, timezone: 'Asia/Kolkata' },
    { name: 'Meerut', country: 'India', population: 1600000, timezone: 'Asia/Kolkata' },
    { name: 'Rajkot', country: 'India', population: 1600000, timezone: 'Asia/Kolkata' },
    { name: 'Kalyan-Dombivali', country: 'India', population: 1500000, timezone: 'Asia/Kolkata' },
    { name: 'Vasai-Virar', country: 'India', population: 1500000, timezone: 'Asia/Kolkata' },
    { name: 'Varanasi', country: 'India', population: 1500000, timezone: 'Asia/Kolkata' }
  ],
}

// US cities by timezone
const usCities: Record<string, CityInfoWithTimezone[]> = {
  'America/New_York': [
    { name: 'New York', country: 'United States', population: 18800000, timezone: 'America/New_York' },
    { name: 'Washington DC', country: 'United States', population: 6400000, timezone: 'America/New_York' },
    { name: 'Philadelphia', country: 'United States', population: 6200000, timezone: 'America/New_York' },
    { name: 'Boston', country: 'United States', population: 4900000, timezone: 'America/New_York' },
    { name: 'Atlanta', country: 'United States', population: 6100000, timezone: 'America/New_York' },
    { name: 'Miami', country: 'United States', population: 6300000, timezone: 'America/New_York' },
    { name: 'Tampa', country: 'United States', population: 3200000, timezone: 'America/New_York' },
    { name: 'Baltimore', country: 'United States', population: 2800000, timezone: 'America/New_York' },
    { name: 'Charlotte', country: 'United States', population: 2700000, timezone: 'America/New_York' },
    { name: 'Orlando', country: 'United States', population: 2600000, timezone: 'America/New_York' },
    { name: 'Pittsburgh', country: 'United States', population: 2300000, timezone: 'America/New_York' },
    { name: 'Jacksonville', country: 'United States', population: 1600000, timezone: 'America/New_York' },
    { name: 'Buffalo', country: 'United States', population: 1100000, timezone: 'America/New_York' },
    { name: 'Ashburn', country: 'United States', population: 43629, timezone: 'America/New_York' },
    { name: 'Raleigh', country: 'United States', population: 469124, timezone: 'America/New_York' },
    { name: 'Richmond', country: 'United States', population: 226610, timezone: 'America/New_York' },
    { name: 'Newark', country: 'United States', population: 282529, timezone: 'America/New_York' },
    { name: 'Jersey City', country: 'United States', population: 292449, timezone: 'America/New_York' },
    { name: 'Trenton', country: 'United States', population: 83412, timezone: 'America/New_York' },
    { name: 'Princeton', country: 'United States', population: 31822, timezone: 'America/New_York' },
    { name: 'Atlantic City', country: 'United States', population: 38429, timezone: 'America/New_York' },
    { name: 'Camden', country: 'United States', population: 73562, timezone: 'America/New_York' },
    { name: 'Hoboken', country: 'United States', population: 60419, timezone: 'America/New_York' },
    { name: 'Paterson', country: 'United States', population: 145233, timezone: 'America/New_York' },
    { name: 'Edison', country: 'United States', population: 107588, timezone: 'America/New_York' },
    { name: 'New Brunswick', country: 'United States', population: 56100, timezone: 'America/New_York' },
  ],
  'America/Chicago': [
    { name: 'Chicago', country: 'United States', population: 8900000, timezone: 'America/Chicago' },
    { name: 'Houston', country: 'United States', population: 7100000, timezone: 'America/Chicago' },
    { name: 'Dallas', country: 'United States', population: 7600000, timezone: 'America/Chicago' },
    { name: 'Minneapolis', country: 'United States', population: 3700000, timezone: 'America/Chicago' },
    { name: 'San Antonio', country: 'United States', population: 2600000, timezone: 'America/Chicago' },
    { name: 'Austin', country: 'United States', population: 2300000, timezone: 'America/Chicago' },
    { name: 'Kansas City', country: 'United States', population: 2200000, timezone: 'America/Chicago' },
    { name: 'Milwaukee', country: 'United States', population: 1600000, timezone: 'America/Chicago' },
    { name: 'New Orleans', country: 'United States', population: 1300000, timezone: 'America/Chicago' },
    { name: 'Memphis', country: 'United States', population: 1300000, timezone: 'America/Chicago' },
    { name: 'Oklahoma City', country: 'United States', population: 1400000, timezone: 'America/Chicago' },
    { name: 'St. Louis', country: 'United States', population: 2150000, timezone: 'America/Chicago' },
    { name: 'Nashville', country: 'United States', population: 1920000, timezone: 'America/Chicago' },
    { name: 'Indianapolis', country: 'United States', population: 2050000, timezone: 'America/Chicago' },
    { name: 'Fort Worth', country: 'United States', population: 927720, timezone: 'America/Chicago' },
    { name: 'Omaha', country: 'United States', population: 486051, timezone: 'America/Chicago' },
    { name: 'Tulsa', country: 'United States', population: 401190, timezone: 'America/Chicago' },
    { name: 'Wichita', country: 'United States', population: 389255, timezone: 'America/Chicago' },
    { name: 'Madison', country: 'United States', population: 269840, timezone: 'America/Chicago' },
    { name: 'Des Moines', country: 'United States', population: 214237, timezone: 'America/Chicago' },
  ],
  'America/Los_Angeles': [
    { name: 'Los Angeles', country: 'United States', population: 12500000, timezone: 'America/Los_Angeles' },
    { name: 'San Francisco', country: 'United States', population: 4700000, timezone: 'America/Los_Angeles' },
    { name: 'Seattle', country: 'United States', population: 4000000, timezone: 'America/Los_Angeles' },
    { name: 'San Diego', country: 'United States', population: 3300000, timezone: 'America/Los_Angeles' },
    { name: 'Portland', country: 'United States', population: 2500000, timezone: 'America/Los_Angeles' },
    { name: 'Sacramento', country: 'United States', population: 2300000, timezone: 'America/Los_Angeles' },
    { name: 'Las Vegas', country: 'United States', population: 2300000, timezone: 'America/Los_Angeles' },
    { name: 'San Jose', country: 'United States', population: 2000000, timezone: 'America/Los_Angeles' },
    { name: 'Mountain View', country: 'United States', population: 82739, timezone: 'America/Los_Angeles' },
    { name: 'Palo Alto', country: 'United States', population: 65364, timezone: 'America/Los_Angeles' },
    { name: 'San Mateo', country: 'United States', population: 105661, timezone: 'America/Los_Angeles' },
    { name: 'Foster City', country: 'United States', population: 34494, timezone: 'America/Los_Angeles' },
    { name: 'Redwood City', country: 'United States', population: 86754, timezone: 'America/Los_Angeles' },
    { name: 'Sunnyvale', country: 'United States', population: 155805, timezone: 'America/Los_Angeles' },
    { name: 'Santa Clara', country: 'United States', population: 127647, timezone: 'America/Los_Angeles' },
    { name: 'Cupertino', country: 'United States', population: 60170, timezone: 'America/Los_Angeles' },
    { name: 'Menlo Park', country: 'United States', population: 35254, timezone: 'America/Los_Angeles' },
    { name: 'Burlingame', country: 'United States', population: 30576, timezone: 'America/Los_Angeles' },
    { name: 'South San Francisco', country: 'United States', population: 67078, timezone: 'America/Los_Angeles' },
    { name: 'Oakland', country: 'United States', population: 440981, timezone: 'America/Los_Angeles' },
    { name: 'Berkeley', country: 'United States', population: 124321, timezone: 'America/Los_Angeles' },
    { name: 'Fremont', country: 'United States', population: 241110, timezone: 'America/Los_Angeles' },
    { name: 'Hayward', country: 'United States', population: 162954, timezone: 'America/Los_Angeles' },
    { name: 'Irvine', country: 'United States', population: 307670, timezone: 'America/Los_Angeles' },
    { name: 'Long Beach', country: 'United States', population: 466742, timezone: 'America/Los_Angeles' },
    { name: 'Anaheim', country: 'United States', population: 350365, timezone: 'America/Los_Angeles' },
    { name: 'Santa Ana', country: 'United States', population: 337977, timezone: 'America/Los_Angeles' },
  ],
  'America/Phoenix': [
    { name: 'Phoenix', country: 'United States', population: 4900000, timezone: 'America/Phoenix' },
    { name: 'Tucson', country: 'United States', population: 1100000, timezone: 'America/Phoenix' },
    { name: 'Mesa', country: 'United States', population: 500000, timezone: 'America/Phoenix' },
  ],
  'America/Denver': [
    { name: 'Denver', country: 'United States', population: 2900000, timezone: 'America/Denver' },
    { name: 'Salt Lake City', country: 'United States', population: 1200000, timezone: 'America/Denver' },
    { name: 'Albuquerque', country: 'United States', population: 900000, timezone: 'America/Denver' },
    { name: 'Colorado Springs', country: 'United States', population: 700000, timezone: 'America/Denver' },
  ],
}

// South Asian cities by timezone
const southAsianCities: Record<string, CityInfoWithTimezone[]> = {
  'Asia/Dhaka': [
    { name: 'Dhaka', country: 'Bangladesh', population: 8906039, timezone: 'Asia/Dhaka' },
    { name: 'Chittagong', country: 'Bangladesh', population: 2581643, timezone: 'Asia/Dhaka' },
  ],
  'Asia/Kathmandu': [
    { name: 'Kathmandu', country: 'Nepal', population: 1442271, timezone: 'Asia/Kathmandu' },
    { name: 'Pokhara', country: 'Nepal', population: 200000, timezone: 'Asia/Kathmandu' },
  ],
  'Asia/Colombo': [
    { name: 'Colombo', country: 'Sri Lanka', population: 752993, timezone: 'Asia/Colombo' },
    { name: 'Kandy', country: 'Sri Lanka', population: 111701, timezone: 'Asia/Colombo' },
  ],
  'Asia/Thimphu': [
    { name: 'Thimphu', country: 'Bhutan', population: 114551, timezone: 'Asia/Thimphu' },
  ],
  'Asia/Kabul': [
    { name: 'Kabul', country: 'Afghanistan', population: 4601789, timezone: 'Asia/Kabul' },
    { name: 'Kandahar', country: 'Afghanistan', population: 491500, timezone: 'Asia/Kabul' },
  ],
}

// Canadian cities by timezone
const canadianCities: Record<string, CityInfoWithTimezone[]> = {
  'America/Toronto': [
    { name: 'Toronto', country: 'Canada', population: 2731571, timezone: 'America/Toronto' },
    { name: 'Ottawa', country: 'Canada', population: 934243, timezone: 'America/Toronto' },
    { name: 'Montreal', country: 'Canada', population: 1704694, timezone: 'America/Toronto' },
  ],
  'America/Vancouver': [
    { name: 'Vancouver', country: 'Canada', population: 631486, timezone: 'America/Vancouver' },
    { name: 'Victoria', country: 'Canada', population: 92141, timezone: 'America/Vancouver' },
  ],
  'America/Edmonton': [
    { name: 'Edmonton', country: 'Canada', population: 932546, timezone: 'America/Edmonton' },
    { name: 'Calgary', country: 'Canada', population: 1239220, timezone: 'America/Edmonton' },
  ],
}

// Middle East cities by timezone
const middleEastCities: Record<string, CityInfoWithTimezone[]> = {
  'Asia/Dubai': [
    { name: 'Dubai', country: 'UAE', population: 3331420, timezone: 'Asia/Dubai' },
    { name: 'Abu Dhabi', country: 'UAE', population: 1412000, timezone: 'Asia/Dubai' },
    { name: 'Sharjah', country: 'UAE', population: 1174000, timezone: 'Asia/Dubai' },
    { name: 'Ajman', country: 'UAE', population: 504846, timezone: 'Asia/Dubai' },
    { name: 'Ras Al Khaimah', country: 'UAE', population: 345000, timezone: 'Asia/Dubai' },
    { name: 'Fujairah', country: 'UAE', population: 192190, timezone: 'Asia/Dubai' },
  ],
  'Asia/Qatar': [
    { name: 'Doha', country: 'Qatar', population: 235157, timezone: 'Asia/Qatar' },
  ],
  'Asia/Bahrain': [
    { name: 'Manama', country: 'Bahrain', population: 217000, timezone: 'Asia/Bahrain' },
  ],
  'Asia/Saudi_Arabia': [
    { name: 'Riyadh', country: 'Saudi Arabia', population: 5250000, timezone: 'Asia/Saudi_Arabia' },
    { name: 'Jeddah', country: 'Saudi Arabia', population: 3976000, timezone: 'Asia/Saudi_Arabia' },
    { name: 'Mecca', country: 'Saudi Arabia', population: 1578000, timezone: 'Asia/Saudi_Arabia' },
    { name: 'Medina', country: 'Saudi Arabia', population: 1182000, timezone: 'Asia/Saudi_Arabia' },
    { name: 'Dammam', country: 'Saudi Arabia', population: 862000, timezone: 'Asia/Saudi_Arabia' },
  ],
  'Asia/Kuwait': [
    { name: 'Kuwait City', country: 'Kuwait', population: 240000, timezone: 'Asia/Kuwait' },
  ],
  'Asia/Oman': [
    { name: 'Muscat', country: 'Oman', population: 1090000, timezone: 'Asia/Oman' },
  ],
  'Asia/Jordan': [
    { name: 'Amman', country: 'Jordan', population: 1100000, timezone: 'Asia/Jordan' },
  ],
  'Asia/Lebanon': [
    { name: 'Beirut', country: 'Lebanon', population: 2200000, timezone: 'Asia/Lebanon' },
  ],
  'Asia/Syria': [
    { name: 'Damascus', country: 'Syria', population: 2500000, timezone: 'Asia/Syria' },
  ],
  'Asia/Iraq': [
    { name: 'Baghdad', country: 'Iraq', population: 7565000, timezone: 'Asia/Iraq' },
  ],
  'Asia/Iran': [
    { name: 'Tehran', country: 'Iran', population: 8846000, timezone: 'Asia/Iran' },
  ],
  'Asia/Turkey': [
    { name: 'Istanbul', country: 'Turkey', population: 15519267, timezone: 'Asia/Turkey' },
    { name: 'Ankara', country: 'Turkey', population: 5639076, timezone: 'Asia/Turkey' },
    { name: 'Izmir', country: 'Turkey', population: 2937343, timezone: 'Asia/Turkey' },
    { name: 'Bursa', country: 'Turkey', population: 1965000, timezone: 'Asia/Turkey' },
    { name: 'Antalya', country: 'Turkey', population: 1512000, timezone: 'Asia/Turkey' },
  ],
  'Asia/Israel': [
    { name: 'Tel Aviv', country: 'Israel', population: 443900, timezone: 'Asia/Israel' },
    { name: 'Jerusalem', country: 'Israel', population: 882700, timezone: 'Asia/Israel' },
  ],
  'Asia/Palestine': [
    { name: 'Gaza', country: 'Palestine', population: 570000, timezone: 'Asia/Palestine' },
  ],
  'Asia/Egypt': [
    { name: 'Cairo', country: 'Egypt', population: 10852000, timezone: 'Africa/Cairo' },
    { name: 'Alexandria', country: 'Egypt', population: 5200000, timezone: 'Africa/Cairo' },
    { name: 'Giza', country: 'Egypt', population: 4775000, timezone: 'Africa/Cairo' },
  ],
  'Asia/Sudan': [
    { name: 'Khartoum', country: 'Sudan', population: 5124600, timezone: 'Africa/Khartoum' },
  ],
  'Asia/Somalia': [
    { name: 'Mogadishu', country: 'Somalia', population: 2587181, timezone: 'Africa/Mogadishu' },
  ],
  'Asia/Yemen': [
    { name: 'Sanaa', country: 'Yemen', population: 4607500, timezone: 'Asia/Yemen' },
  ],
  'Asia/Eritrea': [
    { name: 'Asmara', country: 'Eritrea', population: 1023000, timezone: 'Africa/Asmara' },
  ],
  'Asia/Djibouti': [
    { name: 'Djibouti', country: 'Djibouti', population: 623891, timezone: 'Africa/Djibouti' },
  ],
  'Asia/Kenya': [
    { name: 'Nairobi', country: 'Kenya', population: 4550000, timezone: 'Africa/Nairobi' },
  ],
  'Asia/Uganda': [
    { name: 'Kampala', country: 'Uganda', population: 1659000, timezone: 'Africa/Kampala' },
  ],
  'Asia/Tanzania': [
    { name: 'Dar es Salaam', country: 'Tanzania', population: 6794000, timezone: 'Africa/Dar_es_Salaam' },
  ],
  'Asia/Morocco': [
    { name: 'Casablanca', country: 'Morocco', population: 3359818, timezone: 'Africa/Casablanca' },
  ],
  'Asia/Algeria': [
    { name: 'Algiers', country: 'Algeria', population: 3518000, timezone: 'Africa/Algiers' },
  ],
  'Asia/Tunisia': [
    { name: 'Tunis', country: 'Tunisia', population: 728000, timezone: 'Africa/Tunis' },
  ],
  'Asia/Libya': [
    { name: 'Tripoli', country: 'Libya', population: 1110000, timezone: 'Africa/Tripoli' },
  ],
}

// European cities by timezone
const europeanCities: Record<string, CityInfoWithTimezone[]> = {
  'Europe/London': [
    { name: 'London', country: 'United Kingdom', population: 8982000, timezone: 'Europe/London' },
    { name: 'Birmingham', country: 'United Kingdom', population: 1141816, timezone: 'Europe/London' },
    { name: 'Manchester', country: 'United Kingdom', population: 553230, timezone: 'Europe/London' },
    { name: 'Basingstoke', country: 'United Kingdom', population: 113776, timezone: 'Europe/London' },
  ],
  'Europe/Paris': [
    { name: 'Paris', country: 'France', population: 2148000, timezone: 'Europe/Paris' },
    { name: 'Marseille', country: 'France', population: 861635, timezone: 'Europe/Paris' },
    { name: 'Lyon', country: 'France', population: 513275, timezone: 'Europe/Paris' },
  ],
  'Europe/Berlin': [
    { name: 'Berlin', country: 'Germany', population: 3769000, timezone: 'Europe/Berlin' },
    { name: 'Hamburg', country: 'Germany', population: 1841000, timezone: 'Europe/Berlin' },
    { name: 'Munich', country: 'Germany', population: 1472000, timezone: 'Europe/Berlin' },
  ],
  'Europe/Warsaw': [
    { name: 'Warsaw', country: 'Poland', population: 1793579, timezone: 'Europe/Warsaw' },
    { name: 'Kraków', country: 'Poland', population: 779115, timezone: 'Europe/Warsaw' },
    { name: 'Łódź', country: 'Poland', population: 672185, timezone: 'Europe/Warsaw' },
  ],
  'Europe/Madrid': [
    { name: 'Madrid', country: 'Spain', population: 3266000, timezone: 'Europe/Madrid' },
    { name: 'Barcelona', country: 'Spain', population: 1620000, timezone: 'Europe/Madrid' },
    { name: 'Valencia', country: 'Spain', population: 791413, timezone: 'Europe/Madrid' },
  ],
  'Europe/Rome': [
    { name: 'Rome', country: 'Italy', population: 2873000, timezone: 'Europe/Rome' },
    { name: 'Milan', country: 'Italy', population: 1378689, timezone: 'Europe/Rome' },
    { name: 'Naples', country: 'Italy', population: 962589, timezone: 'Europe/Rome' },
  ],
  'Europe/Moscow': [
    { name: 'Moscow', country: 'Russia', population: 12506468, timezone: 'Europe/Moscow' },
    { name: 'Saint Petersburg', country: 'Russia', population: 5383890, timezone: 'Europe/Moscow' },
    { name: 'Novosibirsk', country: 'Russia', population: 1620162, timezone: 'Europe/Moscow' },
  ],
}

// Get all available timezones with their current offsets
export const getAvailableTimezones = (): Timezone[] => {
  // Combine all city arrays
  const allCities: CityInfoWithTimezone[] = [
    ...indianCities['Asia/Kolkata'],
    ...usCities['America/New_York'],
    ...usCities['America/Chicago'],
    ...usCities['America/Los_Angeles'],
    ...usCities['America/Phoenix'],
    ...usCities['America/Denver'],
    ...southAsianCities['Asia/Dhaka'],
    ...southAsianCities['Asia/Kathmandu'],
    ...southAsianCities['Asia/Colombo'],
    ...southAsianCities['Asia/Thimphu'],
    ...southAsianCities['Asia/Kabul'],
    ...canadianCities['America/Toronto'],
    ...canadianCities['America/Vancouver'],
    ...canadianCities['America/Edmonton'],
    ...middleEastCities['Asia/Dubai'],
    ...middleEastCities['Asia/Qatar'],
    ...middleEastCities['Asia/Bahrain'],
    ...middleEastCities['Asia/Saudi_Arabia'],
    ...middleEastCities['Asia/Kuwait'],
    ...middleEastCities['Asia/Oman'],
    ...middleEastCities['Asia/Jordan'],
    ...middleEastCities['Asia/Lebanon'],
    ...middleEastCities['Asia/Syria'],
    ...middleEastCities['Asia/Iraq'],
    ...middleEastCities['Asia/Iran'],
    ...middleEastCities['Asia/Turkey'],
    ...middleEastCities['Asia/Israel'],
    ...middleEastCities['Asia/Palestine'],
    ...middleEastCities['Asia/Egypt'],
    ...middleEastCities['Asia/Sudan'],
    ...middleEastCities['Asia/Somalia'],
    ...middleEastCities['Asia/Yemen'],
    ...middleEastCities['Asia/Eritrea'],
    ...middleEastCities['Asia/Djibouti'],
    ...middleEastCities['Asia/Kenya'],
    ...middleEastCities['Asia/Uganda'],
    ...middleEastCities['Asia/Tanzania'],
    ...middleEastCities['Asia/Morocco'],
    ...middleEastCities['Asia/Algeria'],
    ...middleEastCities['Asia/Tunisia'],
    ...middleEastCities['Asia/Libya'],
    ...Object.values(europeanCities).flat(),
  ];

  // Convert CityInfo to Timezone format
  return allCities.map(city => ({
    id: city.timezone,
    name: `${city.name}, ${city.country}`,
    city: city.name,
    country: city.country,
    timezone: city.timezone,
    latitude: 0, // TODO: Add real latitude data
    longitude: 0, // TODO: Add real longitude data
    population: city.population,
    offset: 0 // This will be calculated by the parent component
  }));
};

// Format the timezone name with city and offset
export const formatTimezoneName = (timezone: Timezone): string => {
  const offsetHours = Math.abs(timezone.offset);
  const offsetSign = timezone.offset >= 0 ? '+' : '-';
  const offsetHoursStr = Math.floor(offsetHours / 60);
  const offsetMinutesStr = offsetHours % 60;
  
  return `${timezone.name} (${offsetSign}${offsetHoursStr}:${offsetMinutesStr.toString().padStart(2, '0')})`;
}
