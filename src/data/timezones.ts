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
    { id: 'india_delhi', name: 'Delhi', country: 'India', population: 34700000, timezone: 'Asia/Kolkata', latitude: 28.6139, longitude: 77.2090, offset: 5.5 },
    { id: 'india_mumbai', name: 'Mumbai', country: 'India', population: 22100000, timezone: 'Asia/Kolkata', latitude: 19.0760, longitude: 72.8777, offset: 5.5 },
    { id: 'india_kolkata', name: 'Kolkata', country: 'India', population: 15200000, timezone: 'Asia/Kolkata', latitude: 22.5726, longitude: 88.3639, offset: 5.5 },
    { id: 'india_bangalore', name: 'Bangalore', country: 'India', population: 13200000, timezone: 'Asia/Kolkata', latitude: 12.9716, longitude: 77.5946, offset: 5.5 },
    { id: 'india_chennai', name: 'Chennai', country: 'India', population: 11500000, timezone: 'Asia/Kolkata', latitude: 13.0827, longitude: 80.2707, offset: 5.5 },
    { id: 'india_hyderabad', name: 'Hyderabad', country: 'India', population: 10100000, timezone: 'Asia/Kolkata', latitude: 17.3850, longitude: 78.4867, offset: 5.5 },
    { id: 'india_ahmedabad', name: 'Ahmedabad', country: 'India', population: 8400000, timezone: 'Asia/Kolkata', latitude: 23.0225, longitude: 72.5714, offset: 5.5 },
    { id: 'india_pune', name: 'Pune', country: 'India', population: 7400000, timezone: 'Asia/Kolkata', latitude: 18.5204, longitude: 73.8567, offset: 5.5 },
    { id: 'india_surat', name: 'Surat', country: 'India', population: 6900000, timezone: 'Asia/Kolkata', latitude: 21.1702, longitude: 72.8311, offset: 5.5 },
    { id: 'india_jaipur', name: 'Jaipur', country: 'India', population: 4100000, timezone: 'Asia/Kolkata', latitude: 26.9124, longitude: 75.7873, offset: 5.5 },
    { id: 'india_lucknow', name: 'Lucknow', country: 'India', population: 3700000, timezone: 'Asia/Kolkata', latitude: 26.8467, longitude: 80.9462, offset: 5.5 },
    { id: 'india_kanpur', name: 'Kanpur', country: 'India', population: 3400000, timezone: 'Asia/Kolkata', latitude: 26.4499, longitude: 80.3319, offset: 5.5 },
    { id: 'india_nagpur', name: 'Nagpur', country: 'India', population: 3300000, timezone: 'Asia/Kolkata', latitude: 21.1458, longitude: 79.0882, offset: 5.5 },
    { id: 'india_indore', name: 'Indore', country: 'India', population: 2900000, timezone: 'Asia/Kolkata', latitude: 22.7196, longitude: 75.8577, offset: 5.5 },
    { id: 'india_thane', name: 'Thane', country: 'India', population: 2400000, timezone: 'Asia/Kolkata', latitude: 19.2183, longitude: 72.9781, offset: 5.5 },
    { id: 'india_bhopal', name: 'Bhopal', country: 'India', population: 2300000, timezone: 'Asia/Kolkata', latitude: 23.2599, longitude: 77.4126, offset: 5.5 },
    { id: 'india_visakhapatnam', name: 'Visakhapatnam', country: 'India', population: 2200000, timezone: 'Asia/Kolkata', latitude: 17.6868, longitude: 83.2185, offset: 5.5 },
    { id: 'india_pimprichinchwad', name: 'Pimpri-Chinchwad', country: 'India', population: 2100000, timezone: 'Asia/Kolkata', latitude: 18.6279, longitude: 73.8009, offset: 5.5 },
    { id: 'india_patna', name: 'Patna', country: 'India', population: 2100000, timezone: 'Asia/Kolkata', latitude: 25.5941, longitude: 85.1376, offset: 5.5 },
    { id: 'india_vadodara', name: 'Vadodara', country: 'India', population: 2100000, timezone: 'Asia/Kolkata', latitude: 22.3072, longitude: 73.1812, offset: 5.5 },
    { id: 'india_ghaziabad', name: 'Ghaziabad', country: 'India', population: 1900000, timezone: 'Asia/Kolkata', latitude: 28.6692, longitude: 77.4538, offset: 5.5 },
    { id: 'india_ludhiana', name: 'Ludhiana', country: 'India', population: 1800000, timezone: 'Asia/Kolkata', latitude: 30.9010, longitude: 75.8573, offset: 5.5 },
    { id: 'india_agra', name: 'Agra', country: 'India', population: 1800000, timezone: 'Asia/Kolkata', latitude: 27.1767, longitude: 78.0081, offset: 5.5 },
    { id: 'india_nashik', name: 'Nashik', country: 'India', population: 1700000, timezone: 'Asia/Kolkata', latitude: 19.9975, longitude: 73.7898, offset: 5.5 },
    { id: 'india_faridabad', name: 'Faridabad', country: 'India', population: 1600000, timezone: 'Asia/Kolkata', latitude: 28.4089, longitude: 77.3178, offset: 5.5 },
    { id: 'india_meerut', name: 'Meerut', country: 'India', population: 1600000, timezone: 'Asia/Kolkata', latitude: 28.9845, longitude: 77.7064, offset: 5.5 },
    { id: 'india_rajkot', name: 'Rajkot', country: 'India', population: 1600000, timezone: 'Asia/Kolkata', latitude: 22.3039, longitude: 70.8022, offset: 5.5 },
    { id: 'india_kalyandombivali', name: 'Kalyan-Dombivali', country: 'India', population: 1500000, timezone: 'Asia/Kolkata', latitude: 19.2403, longitude: 73.1305, offset: 5.5 },
    { id: 'india_vasaivirar', name: 'Vasai-Virar', country: 'India', population: 1500000, timezone: 'Asia/Kolkata', latitude: 19.3919, longitude: 72.8397, offset: 5.5 },
    { id: 'india_varanasi', name: 'Varanasi', country: 'India', population: 1500000, timezone: 'Asia/Kolkata', latitude: 25.3176, longitude: 82.9739, offset: 5.5 }
  ],
}

// US cities by timezone
const usCities: Record<string, CityInfoWithTimezone[]> = {
  'America/New_York': [
    { id: 'us_newyork', name: 'New York', country: 'United States', population: 18800000, timezone: 'America/New_York', latitude: 40.7128, longitude: -74.0060, offset: -4 },
    { id: 'us_washingtondc', name: 'Washington DC', country: 'United States', population: 6400000, timezone: 'America/New_York', latitude: 38.9072, longitude: -77.0369, offset: -4 },
    { id: 'us_philadelphia', name: 'Philadelphia', country: 'United States', population: 6200000, timezone: 'America/New_York', latitude: 39.9526, longitude: -75.1652, offset: -4 },
    { id: 'us_boston', name: 'Boston', country: 'United States', population: 4900000, timezone: 'America/New_York', latitude: 42.3601, longitude: -71.0589, offset: -4 },
    { id: 'us_atlanta', name: 'Atlanta', country: 'United States', population: 6100000, timezone: 'America/New_York', latitude: 33.7490, longitude: -84.3880, offset: -4 },
    { id: 'us_miami', name: 'Miami', country: 'United States', population: 6300000, timezone: 'America/New_York', latitude: 25.7617, longitude: -80.1918, offset: -4 },
    { id: 'us_tampa', name: 'Tampa', country: 'United States', population: 3200000, timezone: 'America/New_York', latitude: 27.9506, longitude: -82.4572, offset: -4 },
    { id: 'us_baltimore', name: 'Baltimore', country: 'United States', population: 2800000, timezone: 'America/New_York', latitude: 39.2904, longitude: -76.6122, offset: -4 },
    { id: 'us_charlotte', name: 'Charlotte', country: 'United States', population: 2700000, timezone: 'America/New_York', latitude: 35.2271, longitude: -80.8431, offset: -4 },
    { id: 'us_orlando', name: 'Orlando', country: 'United States', population: 2600000, timezone: 'America/New_York', latitude: 28.5383, longitude: -81.3792, offset: -4 },
    { id: 'us_pittsburgh', name: 'Pittsburgh', country: 'United States', population: 2300000, timezone: 'America/New_York', latitude: 40.4406, longitude: -79.9959, offset: -4 },
    { id: 'us_jacksonville', name: 'Jacksonville', country: 'United States', population: 1600000, timezone: 'America/New_York', latitude: 30.3322, longitude: -81.6557, offset: -4 },
    { id: 'us_buffalo', name: 'Buffalo', country: 'United States', population: 1100000, timezone: 'America/New_York', latitude: 42.8864, longitude: -78.8784, offset: -4 },
    { id: 'us_ashburn', name: 'Ashburn', country: 'United States', population: 43629, timezone: 'America/New_York', latitude: 39.0437, longitude: -77.4875, offset: -4 },
    { id: 'us_raleigh', name: 'Raleigh', country: 'United States', population: 469124, timezone: 'America/New_York', latitude: 35.7796, longitude: -78.6382, offset: -4 },
    { id: 'us_richmond', name: 'Richmond', country: 'United States', population: 226610, timezone: 'America/New_York', latitude: 37.5407, longitude: -77.4360, offset: -4 },
    { id: 'us_newark', name: 'Newark', country: 'United States', population: 282529, timezone: 'America/New_York', latitude: 40.7357, longitude: -74.1724, offset: -4 },
    { id: 'us_jerseycity', name: 'Jersey City', country: 'United States', population: 292449, timezone: 'America/New_York', latitude: 40.7178, longitude: -74.0431, offset: -4 },
    { id: 'us_trenton', name: 'Trenton', country: 'United States', population: 83412, timezone: 'America/New_York', latitude: 40.2206, longitude: -74.7597, offset: -4 },
    { id: 'us_princeton', name: 'Princeton', country: 'United States', population: 31822, timezone: 'America/New_York', latitude: 40.3573, longitude: -74.6672, offset: -4 },
    { id: 'us_atlanticcity', name: 'Atlantic City', country: 'United States', population: 38429, timezone: 'America/New_York', latitude: 39.3643, longitude: -74.4229, offset: -4 },
    { id: 'us_camden', name: 'Camden', country: 'United States', population: 73562, timezone: 'America/New_York', latitude: 39.9259, longitude: -75.1196, offset: -4 },
    { id: 'us_hoboken', name: 'Hoboken', country: 'United States', population: 60419, timezone: 'America/New_York', latitude: 40.7440, longitude: -74.0324, offset: -4 },
    { id: 'us_paterson', name: 'Paterson', country: 'United States', population: 145233, timezone: 'America/New_York', latitude: 40.9168, longitude: -74.1718, offset: -4 },
    { id: 'us_edison', name: 'Edison', country: 'United States', population: 107588, timezone: 'America/New_York', latitude: 40.5187, longitude: -74.4121, offset: -4 },
    { id: 'us_newbrunswick', name: 'New Brunswick', country: 'United States', population: 56100, timezone: 'America/New_York', latitude: 40.4862, longitude: -74.4518, offset: -4 },
  ],
  'America/Chicago': [
    { id: 'us_chicago', name: 'Chicago', country: 'United States', population: 8900000, timezone: 'America/Chicago', latitude: 41.8781, longitude: -87.6298, offset: -5 },
    { id: 'us_houston', name: 'Houston', country: 'United States', population: 7100000, timezone: 'America/Chicago', latitude: 29.7604, longitude: -95.3698, offset: -5 },
    { id: 'us_dallas', name: 'Dallas', country: 'United States', population: 7600000, timezone: 'America/Chicago', latitude: 32.7767, longitude: -96.7970, offset: -5 },
    { id: 'us_minneapolis', name: 'Minneapolis', country: 'United States', population: 3700000, timezone: 'America/Chicago', latitude: 44.9778, longitude: -93.2650, offset: -5 },
    { id: 'us_sanantonio', name: 'San Antonio', country: 'United States', population: 2600000, timezone: 'America/Chicago', latitude: 29.4241, longitude: -98.4936, offset: -5 },
    { id: 'us_austin', name: 'Austin', country: 'United States', population: 2300000, timezone: 'America/Chicago', latitude: 30.2672, longitude: -97.7431, offset: -5 },
    { id: 'us_kansascity', name: 'Kansas City', country: 'United States', population: 2200000, timezone: 'America/Chicago', latitude: 39.0997, longitude: -94.5786, offset: -5 },
    { id: 'us_milwaukee', name: 'Milwaukee', country: 'United States', population: 1600000, timezone: 'America/Chicago', latitude: 43.0389, longitude: -87.9065, offset: -5 },
    { id: 'us_neworleans', name: 'New Orleans', country: 'United States', population: 1300000, timezone: 'America/Chicago', latitude: 29.9511, longitude: -90.0715, offset: -5 },
    { id: 'us_memphis', name: 'Memphis', country: 'United States', population: 1300000, timezone: 'America/Chicago', latitude: 35.1495, longitude: -90.0490, offset: -5 },
    { id: 'us_oklahomacity', name: 'Oklahoma City', country: 'United States', population: 1400000, timezone: 'America/Chicago', latitude: 35.4676, longitude: -97.5164, offset: -5 },
    { id: 'us_stlouis', name: 'St. Louis', country: 'United States', population: 2150000, timezone: 'America/Chicago', latitude: 38.6270, longitude: -90.1994, offset: -5 },
    { id: 'us_nashville', name: 'Nashville', country: 'United States', population: 1920000, timezone: 'America/Chicago', latitude: 36.1627, longitude: -86.7816, offset: -5 },
    { id: 'us_indianapolis', name: 'Indianapolis', country: 'United States', population: 2050000, timezone: 'America/Chicago', latitude: 39.7684, longitude: -86.1581, offset: -5 },
    { id: 'us_fortworth', name: 'Fort Worth', country: 'United States', population: 927720, timezone: 'America/Chicago', latitude: 32.7555, longitude: -97.3308, offset: -5 },
    { id: 'us_omaha', name: 'Omaha', country: 'United States', population: 486051, timezone: 'America/Chicago', latitude: 41.2565, longitude: -95.9345, offset: -5 },
    { id: 'us_tulsa', name: 'Tulsa', country: 'United States', population: 401190, timezone: 'America/Chicago', latitude: 36.1540, longitude: -95.9928, offset: -5 },
    { id: 'us_wichita', name: 'Wichita', country: 'United States', population: 389255, timezone: 'America/Chicago', latitude: 37.6872, longitude: -97.3301, offset: -5 },
    { name: 'Madison', country: 'United States', population: 269840, timezone: 'America/Chicago' },
    { name: 'Des Moines', country: 'United States', population: 214237, timezone: 'America/Chicago' },
  ],
  'America/Los_Angeles': [
    { id: 'us_losangeles', name: 'Los Angeles', country: 'United States', population: 12500000, timezone: 'America/Los_Angeles', latitude: 34.0522, longitude: -118.2437, offset: -7 },
    { id: 'us_sanfrancisco', name: 'San Francisco', country: 'United States', population: 4700000, timezone: 'America/Los_Angeles', latitude: 37.7749, longitude: -122.4194, offset: -7 },
    { id: 'us_seattle', name: 'Seattle', country: 'United States', population: 4000000, timezone: 'America/Los_Angeles', latitude: 47.6062, longitude: -122.3321, offset: -7 },
    { id: 'us_sandiego', name: 'San Diego', country: 'United States', population: 3300000, timezone: 'America/Los_Angeles', latitude: 32.7157, longitude: -117.1611, offset: -7 },
    { id: 'us_portland', name: 'Portland', country: 'United States', population: 2500000, timezone: 'America/Los_Angeles', latitude: 45.5155, longitude: -122.6789, offset: -7 },
    { id: 'us_sacramento', name: 'Sacramento', country: 'United States', population: 2300000, timezone: 'America/Los_Angeles', latitude: 38.5816, longitude: -121.4944, offset: -7 },
    { id: 'us_lasvegas', name: 'Las Vegas', country: 'United States', population: 2300000, timezone: 'America/Los_Angeles', latitude: 36.1699, longitude: -115.1398, offset: -7 },
    { id: 'us_sanjose', name: 'San Jose', country: 'United States', population: 2000000, timezone: 'America/Los_Angeles', latitude: 37.3382, longitude: -121.8863, offset: -7 },
    { id: 'us_mountainview', name: 'Mountain View', country: 'United States', population: 82739, timezone: 'America/Los_Angeles', latitude: 37.3861, longitude: -122.0839, offset: -7 },
    { id: 'us_paloalto', name: 'Palo Alto', country: 'United States', population: 65364, timezone: 'America/Los_Angeles', latitude: 37.4419, longitude: -122.1430, offset: -7 },
    { id: 'us_sanmateo', name: 'San Mateo', country: 'United States', population: 105661, timezone: 'America/Los_Angeles', latitude: 37.5630, longitude: -122.3255, offset: -7 },
    { id: 'us_fostercity', name: 'Foster City', country: 'United States', population: 34494, timezone: 'America/Los_Angeles', latitude: 37.5585, longitude: -122.2711, offset: -7 },
    { id: 'us_redwoodcity', name: 'Redwood City', country: 'United States', population: 86754, timezone: 'America/Los_Angeles', latitude: 37.4852, longitude: -122.2364, offset: -7 },
    { id: 'us_sunnyvale', name: 'Sunnyvale', country: 'United States', population: 155805, timezone: 'America/Los_Angeles', latitude: 37.3688, longitude: -122.0363, offset: -7 },
    { id: 'us_santaclara', name: 'Santa Clara', country: 'United States', population: 127647, timezone: 'America/Los_Angeles', latitude: 37.3541, longitude: -121.9552, offset: -7 },
    { id: 'us_cupertino', name: 'Cupertino', country: 'United States', population: 60170, timezone: 'America/Los_Angeles', latitude: 37.3230, longitude: -122.0322, offset: -7 },
    { id: 'us_menlopark', name: 'Menlo Park', country: 'United States', population: 35254, timezone: 'America/Los_Angeles', latitude: 37.4538, longitude: -122.1822, offset: -7 },
    { id: 'us_burlingame', name: 'Burlingame', country: 'United States', population: 30576, timezone: 'America/Los_Angeles', latitude: 37.5784, longitude: -122.3481, offset: -7 },
    { id: 'us_southsanfrancisco', name: 'South San Francisco', country: 'United States', population: 67078, timezone: 'America/Los_Angeles', latitude: 37.6547, longitude: -122.4077, offset: -7 },
    { id: 'us_oakland', name: 'Oakland', country: 'United States', population: 440981, timezone: 'America/Los_Angeles', latitude: 37.8044, longitude: -122.2711, offset: -7 },
    { id: 'us_berkeley', name: 'Berkeley', country: 'United States', population: 124321, timezone: 'America/Los_Angeles', latitude: 37.8716, longitude: -122.2727, offset: -7 },
    { id: 'us_fremont', name: 'Fremont', country: 'United States', population: 241110, timezone: 'America/Los_Angeles', latitude: 37.5485, longitude: -121.9886, offset: -7 },
    { id: 'us_hayward', name: 'Hayward', country: 'United States', population: 162954, timezone: 'America/Los_Angeles', latitude: 37.6688, longitude: -122.0808, offset: -7 },
    { id: 'us_irvine', name: 'Irvine', country: 'United States', population: 307670, timezone: 'America/Los_Angeles', latitude: 33.6846, longitude: -117.8265, offset: -7 },
    { id: 'us_longbeach', name: 'Long Beach', country: 'United States', population: 466742, timezone: 'America/Los_Angeles', latitude: 33.7701, longitude: -118.1937, offset: -7 },
    { id: 'us_anaheim', name: 'Anaheim', country: 'United States', population: 350365, timezone: 'America/Los_Angeles', latitude: 33.8366, longitude: -117.9143, offset: -7 },
    { id: 'us_santaana', name: 'Santa Ana', country: 'United States', population: 337977, timezone: 'America/Los_Angeles', latitude: 33.7455, longitude: -117.8677, offset: -7 },
  ],
  'America/Phoenix': [
    { id: 'us_phoenix', name: 'Phoenix', country: 'United States', population: 4900000, timezone: 'America/Phoenix', latitude: 33.4484, longitude: -112.0740, offset: -7 },
    { id: 'us_tucson', name: 'Tucson', country: 'United States', population: 1100000, timezone: 'America/Phoenix', latitude: 32.2226, longitude: -110.9747, offset: -7 },
    { id: 'us_mesa', name: 'Mesa', country: 'United States', population: 500000, timezone: 'America/Phoenix', latitude: 33.4152, longitude: -111.8315, offset: -7 },
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
// European cities by timezone
const europeanCities: Record<string, CityInfoWithTimezone[]> = {
  'Europe/London': [
    { id: 'europe_london_uk', name: 'London', country: 'United Kingdom', population: 9002488, timezone: 'Europe/London', latitude: 51.5074, longitude: -0.1278, offset: 0 },
    { id: 'europe_manchester_uk', name: 'Manchester', country: 'United Kingdom', population: 2730076, timezone: 'Europe/London', latitude: 53.4830, longitude: -2.2446, offset: 0 },
    { id: 'europe_birmingham_uk', name: 'Birmingham', country: 'United Kingdom', population: 2607437, timezone: 'Europe/London', latitude: 52.4862, longitude: -1.8904, offset: 0 },
  ],
  'Europe/Paris': [
    { id: 'europe_paris_france', name: 'Paris', country: 'France', population: 11142303, timezone: 'Europe/Paris', latitude: 48.8566, longitude: 2.3522, offset: 1 },
    { id: 'europe_berlin_germany', name: 'Berlin', country: 'Germany', population: 3669495, timezone: 'Europe/Berlin', latitude: 52.5200, longitude: 13.4050, offset: 1 },
    { id: 'europe_madrid_spain', name: 'Madrid', country: 'Spain', population: 6642000, timezone: 'Europe/Madrid', latitude: 40.4168, longitude: -3.7038, offset: 1 },
    { id: 'europe_rome_italy', name: 'Rome', country: 'Italy', population: 4342212, timezone: 'Europe/Rome', latitude: 41.9028, longitude: 12.4964, offset: 1 },
    { id: 'europe_amsterdam_netherlands', name: 'Amsterdam', country: 'Netherlands', population: 2503786, timezone: 'Europe/Amsterdam', latitude: 52.3676, longitude: 4.9041, offset: 1 },
  ],
  'Europe/Moscow': [
    { id: 'europe_moscow_russia', name: 'Moscow', country: 'Russia', population: 12506468, timezone: 'Europe/Moscow', latitude: 55.7558, longitude: 37.6173, offset: 3 },
    { id: 'europe_stpetersburg_russia', name: 'Saint Petersburg', country: 'Russia', population: 5351935, timezone: 'Europe/Moscow', latitude: 59.9343, longitude: 30.3351, offset: 3 },
  ]
}

// Oceanian cities by timezone
const oceanianCities: Record<string, CityInfoWithTimezone[]> = {
  'Australia/Sydney': [
    { id: 'australia_sydney', name: 'Sydney', country: 'Australia', population: 5367206, timezone: 'Australia/Sydney', latitude: -33.8688, longitude: 151.2093, offset: 10 },
    { id: 'australia_melbourne', name: 'Melbourne', country: 'Australia', population: 5078193, timezone: 'Australia/Melbourne', latitude: -37.8136, longitude: 144.9631, offset: 10 },
    { id: 'australia_brisbane', name: 'Brisbane', country: 'Australia', population: 2560720, timezone: 'Australia/Brisbane', latitude: -27.4705, longitude: 153.0260, offset: 10 },
  ],
  'Pacific/Auckland': [
    { id: 'pacific_auckland_nz', name: 'Auckland', country: 'New Zealand', population: 1657200, timezone: 'Pacific/Auckland', latitude: -36.8509, longitude: 174.7645, offset: 12 },
    { id: 'pacific_wellington_nz', name: 'Wellington', country: 'New Zealand', population: 212700, timezone: 'Pacific/Auckland', latitude: -41.2866, longitude: 174.7756, offset: 12 },
  ]
}

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

// Get all available timezones with their current offsets
export const getAvailableTimezones = (): Timezone[] => {
  // Combine all city arrays
  const allCities: CityInfoWithTimezone[] = [
    ...Object.values(indianCities).flat(),
    ...Object.values(usCities).flat(),
    ...Object.values(southAsianCities).flat(),
    ...Object.values(canadianCities).flat(),
    ...Object.values(middleEastCities).flat(),
    ...Object.values(europeanCities).flat(),
    ...Object.values(oceanianCities).flat(),
  ];

  // Convert CityInfo to Timezone format
  return allCities.map(city => ({
    id: city.timezone,
    name: `${city.name}, ${city.country}`,
    city: city.name,
    country: city.country,
    timezone: city.timezone,
    latitude: city.latitude, 
    longitude: city.longitude, 
    population: city.population,
    offset: city.offset 
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
