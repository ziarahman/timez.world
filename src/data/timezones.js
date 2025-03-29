"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableTimezones = getAvailableTimezones;
exports.formatTimezoneName = formatTimezoneName;
var luxon_1 = require("luxon");
// Major cities from GeoNames database, sorted by population
// Indian cities by timezone
var indianCities = {
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
};
// US cities by timezone
var usCities = {
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
        { name: 'Newark', country: 'United States', population: 282529 },
        { name: 'Jersey City', country: 'United States', population: 292449 },
        { name: 'Trenton', country: 'United States', population: 83412 },
        { name: 'Princeton', country: 'United States', population: 31822 },
        { name: 'Atlantic City', country: 'United States', population: 38429 },
        { name: 'Camden', country: 'United States', population: 73562 },
        { name: 'Hoboken', country: 'United States', population: 60419 },
        { name: 'Paterson', country: 'United States', population: 145233 },
        { name: 'Edison', country: 'United States', population: 107588 },
        { name: 'New Brunswick', country: 'United States', population: 56100 },
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
        { name: 'St. Louis', country: 'United States', population: 2150000 },
        { name: 'Nashville', country: 'United States', population: 1920000 },
        { name: 'Indianapolis', country: 'United States', population: 2050000 },
        { name: 'Fort Worth', country: 'United States', population: 927720 },
        { name: 'Omaha', country: 'United States', population: 486051 },
        { name: 'Tulsa', country: 'United States', population: 401190 },
        { name: 'Wichita', country: 'United States', population: 389255 },
        { name: 'Madison', country: 'United States', population: 269840 },
        { name: 'Des Moines', country: 'United States', population: 214237 },
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
        { name: 'San Mateo', country: 'United States', population: 105661 },
        { name: 'Foster City', country: 'United States', population: 34494 },
        { name: 'Redwood City', country: 'United States', population: 86754 },
        { name: 'Sunnyvale', country: 'United States', population: 155805 },
        { name: 'Santa Clara', country: 'United States', population: 127647 },
        { name: 'Cupertino', country: 'United States', population: 60170 },
        { name: 'Menlo Park', country: 'United States', population: 35254 },
        { name: 'Burlingame', country: 'United States', population: 30576 },
        { name: 'South San Francisco', country: 'United States', population: 67078 },
        { name: 'Oakland', country: 'United States', population: 440981 },
        { name: 'Berkeley', country: 'United States', population: 124321 },
        { name: 'Fremont', country: 'United States', population: 241110 },
        { name: 'Hayward', country: 'United States', population: 162954 },
        { name: 'Irvine', country: 'United States', population: 307670 },
        { name: 'Long Beach', country: 'United States', population: 466742 },
        { name: 'Anaheim', country: 'United States', population: 350365 },
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
};
// South Asian cities by timezone
var southAsianCities = {
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
};
// Global cities
// Canadian cities by timezone
var canadianCities = {
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
};
// European cities by timezone
var europeanCities = {
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
};
// Middle Eastern cities by timezone
var middleEastCities = {
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
};
// Australian cities by timezone
var australianCities = {
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
};
// South American cities by timezone
var southAmericanCities = {
    'America/Sao_Paulo': [
        { name: 'Rio de Janeiro', country: 'Brazil', population: 6747815, timezone: 'America/Sao_Paulo' },
        { name: 'Belo Horizonte', country: 'Brazil', population: 2521564, timezone: 'America/Sao_Paulo' },
        { name: 'São Paulo', country: 'Brazil', population: 12325232, timezone: 'America/Sao_Paulo' },
    ],
    'America/Argentina/Buenos_Aires': [
        { name: 'Buenos Aires', country: 'Argentina', population: 2891082, timezone: 'America/Argentina/Buenos_Aires' },
        { name: 'Córdoba', country: 'Argentina', population: 1430554, timezone: 'America/Argentina/Cordoba' },
    ],
    'America/Santiago': [
        { name: 'Santiago', country: 'Chile', population: 6158080, timezone: 'America/Santiago' },
        { name: 'Valparaíso', country: 'Chile', population: 284630, timezone: 'America/Santiago' },
    ],
    'America/Lima': [
        { name: 'Lima', country: 'Peru', population: 8852000, timezone: 'America/Lima' },
        { name: 'Arequipa', country: 'Peru', population: 1008290, timezone: 'America/Lima' },
    ],
    'America/Bogota': [
        { name: 'Bogotá', country: 'Colombia', population: 7181469, timezone: 'America/Bogota' },
        { name: 'Medellín', country: 'Colombia', population: 2529403, timezone: 'America/Bogota' },
    ],
};
// All major Chinese cities use Asia/Shanghai timezone
var chinaCities = [
    { name: 'Shanghai', country: 'China', population: 30500000, timezone: 'Asia/Shanghai' },
    { name: 'Beijing', country: 'China', population: 22600000, timezone: 'Asia/Shanghai' },
    { name: 'Guangzhou', country: 'China', population: 19000000, timezone: 'Asia/Shanghai' },
    { name: 'Shenzhen', country: 'China', population: 17494398, timezone: 'Asia/Shanghai' },
    { name: 'Chongqing', country: 'China', population: 16875000, timezone: 'Asia/Shanghai' },
    { name: 'Tianjin', country: 'China', population: 15200000, timezone: 'Asia/Shanghai' },
    { name: 'Chengdu', country: 'China', population: 16311600, timezone: 'Asia/Shanghai' },
    { name: 'Wuhan', country: 'China', population: 11081000, timezone: 'Asia/Shanghai' },
    { name: 'Hangzhou', country: 'China', population: 10360000, timezone: 'Asia/Shanghai' },
    { name: 'Xi\'an', country: 'China', population: 9600000, timezone: 'Asia/Shanghai' },
    { name: 'Zhengzhou', country: 'China', population: 9000000, timezone: 'Asia/Shanghai' },
    { name: 'Shenyang', country: 'China', population: 8500000, timezone: 'Asia/Shanghai' },
    { name: 'Nanjing', country: 'China', population: 8400000, timezone: 'Asia/Shanghai' },
    { name: 'Qingdao', country: 'China', population: 7700000, timezone: 'Asia/Shanghai' },
    { name: 'Changsha', country: 'China', population: 7500000, timezone: 'Asia/Shanghai' },
    { name: 'Kunming', country: 'China', population: 7200000, timezone: 'Asia/Shanghai' },
    { name: 'Dalian', country: 'China', population: 6700000, timezone: 'Asia/Shanghai' },
    { name: 'Xiamen', country: 'China', population: 5200000, timezone: 'Asia/Shanghai' },
    { name: 'Suzhou', country: 'China', population: 5000000, timezone: 'Asia/Shanghai' },
    { name: 'Ningbo', country: 'China', population: 4900000, timezone: 'Asia/Shanghai' }
];
var globalCities = {
    // East Asia
    // China (all cities use Asia/Shanghai timezone)
    'Shanghai': { name: 'Shanghai', country: 'China', population: 30500000, timezone: 'Asia/Shanghai' },
    // Japan
    'Tokyo': { name: 'Tokyo', country: 'Japan', population: 37000000, timezone: 'Asia/Tokyo' },
    'Osaka': { name: 'Osaka', country: 'Japan', population: 18900000, timezone: 'Asia/Tokyo' },
    'Nagoya': { name: 'Nagoya', country: 'Japan', population: 9507835, timezone: 'Asia/Tokyo' },
    'Fukuoka': { name: 'Fukuoka', country: 'Japan', population: 5538142, timezone: 'Asia/Tokyo' },
    'Sapporo': { name: 'Sapporo', country: 'Japan', population: 1973832, timezone: 'Asia/Tokyo' }, // Fixed: Using standard Asia/Tokyo timezone
    // South Korea
    'Seoul': { name: 'Seoul', country: 'South Korea', population: 9900000, timezone: 'Asia/Seoul' },
    'Busan': { name: 'Busan', country: 'South Korea', population: 3400000, timezone: 'Asia/Seoul' }, // Fixed: Using standard Asia/Seoul timezone
    // South Asia
    'Delhi': { name: 'Delhi', country: 'India', population: 34700000, timezone: 'Asia/Kolkata' },
    'Karachi': { name: 'Karachi', country: 'Pakistan', population: 16800000, timezone: 'Asia/Karachi' },
    'Dhaka': { name: 'Dhaka', country: 'Bangladesh', population: 22500000, timezone: 'Asia/Dhaka' },
    // Southeast Asia
    'Jakarta': { name: 'Jakarta', country: 'Indonesia', population: 33430000, timezone: 'Asia/Jakarta' },
    'Manila': { name: 'Manila', country: 'Philippines', population: 24300000, timezone: 'Asia/Manila' },
    'Bangkok': { name: 'Bangkok', country: 'Thailand', population: 17066000, timezone: 'Asia/Bangkok' },
    'Ho Chi Minh City': { name: 'Ho Chi Minh City', country: 'Vietnam', population: 13500000, timezone: 'Asia/Ho_Chi_Minh' },
    'Singapore': { name: 'Singapore', country: 'Singapore', population: 5850342, timezone: 'Asia/Singapore' },
    'Hanoi': { name: 'Hanoi', country: 'Vietnam', population: 8100000, timezone: 'Asia/Ho_Chi_Minh' }, // Fixed: Using standard Asia/Ho_Chi_Minh timezone
    'Kuala Lumpur': { name: 'Kuala Lumpur', country: 'Malaysia', population: 7900000, timezone: 'Asia/Kuala_Lumpur' },
    // Middle East
    'Cairo': { name: 'Cairo', country: 'Egypt', population: 23100000, timezone: 'Africa/Cairo' }, // Fixed: Using correct IANA identifier
    'Istanbul': { name: 'Istanbul', country: 'Turkey', population: 16200000, timezone: 'Europe/Istanbul' }, // Fixed: Europe/Istanbul is the correct IANA identifier
    'Tehran': { name: 'Tehran', country: 'Iran', population: 13600000, timezone: 'Asia/Tehran' },
    'Riyadh': { name: 'Riyadh', country: 'Saudi Arabia', population: 7600000, timezone: 'Asia/Riyadh' },
    'Baghdad': { name: 'Baghdad', country: 'Iraq', population: 7511000, timezone: 'Asia/Baghdad' },
    'Dubai': { name: 'Dubai', country: 'UAE', population: 3500000, timezone: 'Asia/Dubai' },
    // Note: Abu Dhabi and Sharjah use the same timezone as Dubai (Asia/Dubai)
    // We'll add them to the middleEastCities collection instead to avoid duplicate keys
    // Using standard IANA timezone identifiers
    'Asia/Qatar': { name: 'Doha', country: 'Qatar', population: 1450000, timezone: 'Asia/Qatar' },
    'Asia/Muscat': { name: 'Muscat', country: 'Oman', population: 1720000, timezone: 'Asia/Muscat' },
    // Kuwait City is added to the middleEastCities collection under Asia/Riyadh
    'Asia/Amman': { name: 'Amman', country: 'Jordan', population: 4007526, timezone: 'Asia/Amman' },
    'Asia/Beirut': { name: 'Beirut', country: 'Lebanon', population: 2200000, timezone: 'Asia/Beirut' },
    // Africa
    'Africa/Lagos': { name: 'Lagos', country: 'Nigeria', population: 21000000, timezone: 'Africa/Lagos' },
    'Africa/Kinshasa': { name: 'Kinshasa', country: 'DR Congo', population: 15500000, timezone: 'Africa/Kinshasa' },
    'Africa/Johannesburg': { name: 'Johannesburg', country: 'South Africa', population: 6200000, timezone: 'Africa/Johannesburg' },
    'Africa/Nairobi': { name: 'Nairobi', country: 'Kenya', population: 5400000, timezone: 'Africa/Nairobi' },
    'Africa/Addis_Ababa': { name: 'Addis Ababa', country: 'Ethiopia', population: 4800000, timezone: 'Africa/Addis_Ababa' },
    // Europe
    'Europe/Moscow': { name: 'Moscow', country: 'Russia', population: 12700000, timezone: 'Europe/Moscow' },
    'Europe/Paris': { name: 'Paris', country: 'France', population: 11300000, timezone: 'Europe/Paris' },
    'Europe/London': { name: 'London', country: 'UK', population: 9500000, timezone: 'Europe/London' },
    'Europe/Madrid': { name: 'Madrid', country: 'Spain', population: 6700000, timezone: 'Europe/Madrid' },
    'Europe/Rome': { name: 'Rome', country: 'Italy', population: 4400000, timezone: 'Europe/Rome' },
    'Europe/Berlin': { name: 'Berlin', country: 'Germany', population: 3700000, timezone: 'Europe/Berlin' },
    'Europe/Warsaw': { name: 'Warsaw', country: 'Poland', population: 1790658, timezone: 'Europe/Warsaw' },
    'Europe/Amsterdam': { name: 'Amsterdam', country: 'Netherlands', population: 1149000, timezone: 'Europe/Amsterdam' },
    'Europe/Athens': { name: 'Athens', country: 'Greece', population: 3153000, timezone: 'Europe/Athens' },
    'Europe/Stockholm': { name: 'Stockholm', country: 'Sweden', population: 1632798, timezone: 'Europe/Stockholm' },
    // Australia & Pacific
    'Sydney': { name: 'Sydney', country: 'Australia', population: 5400000, timezone: 'Australia/Sydney' },
    'Melbourne': { name: 'Melbourne', country: 'Australia', population: 5080000, timezone: 'Australia/Melbourne' },
    'Brisbane': { name: 'Brisbane', country: 'Australia', population: 2560000, timezone: 'Australia/Brisbane' },
    'Perth': { name: 'Perth', country: 'Australia', population: 2100000, timezone: 'Australia/Perth' },
    'Adelaide': { name: 'Adelaide', country: 'Australia', population: 1376601, timezone: 'Australia/Adelaide' },
    'Canberra': { name: 'Canberra', country: 'Australia', population: 431380, timezone: 'Australia/Sydney' }, // Canberra uses Sydney timezone
    'Hobart': { name: 'Hobart', country: 'Australia', population: 240342, timezone: 'Australia/Hobart' },
    'Darwin': { name: 'Darwin', country: 'Australia', population: 147255, timezone: 'Australia/Darwin' },
    'Auckland': { name: 'Auckland', country: 'New Zealand', population: 1660000, timezone: 'Pacific/Auckland' },
    'Wellington': { name: 'Wellington', country: 'New Zealand', population: 412500, timezone: 'Pacific/Auckland' }, // Fixed: Using standard Pacific/Auckland timezone
    'Suva': { name: 'Suva', country: 'Fiji', population: 93970, timezone: 'Pacific/Fiji' },
    // Americas
    // North America
    'Mexico City': { name: 'Mexico City', country: 'Mexico', population: 22800000, timezone: 'America/Mexico_City' },
    'New York': { name: 'New York', country: 'United States', population: 18800000, timezone: 'America/New_York' },
    'Los Angeles': { name: 'Los Angeles', country: 'United States', population: 12500000, timezone: 'America/Los_Angeles' },
    'Chicago': { name: 'Chicago', country: 'United States', population: 8900000, timezone: 'America/Chicago' },
    'Toronto': { name: 'Toronto', country: 'Canada', population: 6900000, timezone: 'America/Toronto' },
    'Houston': { name: 'Houston', country: 'United States', population: 6600000, timezone: 'America/Chicago' }, // Fixed: Using standard America/Chicago timezone
    'Phoenix': { name: 'Phoenix', country: 'United States', population: 4900000, timezone: 'America/Phoenix' },
    'Vancouver': { name: 'Vancouver', country: 'Canada', population: 2500000, timezone: 'America/Vancouver' },
    // South America
    'São Paulo': { name: 'São Paulo', country: 'Brazil', population: 22400000, timezone: 'America/Sao_Paulo' },
    'Lima': { name: 'Lima', country: 'Peru', population: 11000000, timezone: 'America/Lima' },
    'Bogotá': { name: 'Bogotá', country: 'Colombia', population: 10900000, timezone: 'America/Bogota' },
    'Rio de Janeiro': { name: 'Rio de Janeiro', country: 'Brazil', population: 13500000, timezone: 'America/Sao_Paulo' }, // Fixed: Using standard America/Sao_Paulo timezone
    'Santiago': { name: 'Santiago', country: 'Chile', population: 6900000, timezone: 'America/Santiago' },
    'Buenos Aires': { name: 'Buenos Aires', country: 'Argentina', population: 15800000, timezone: 'America/Argentina/Buenos_Aires' }, // Fixed: Using correct IANA identifier
    'Caracas': { name: 'Caracas', country: 'Venezuela', population: 3000000, timezone: 'America/Caracas' },
    // Additional African cities
    'Casablanca': { name: 'Casablanca', country: 'Morocco', population: 3359818, timezone: 'Africa/Casablanca' },
    'Guadalajara': { name: 'Guadalajara', country: 'Mexico', population: 1495182, timezone: 'America/Mexico_City' } // Fixed: Using standard America/Mexico_City timezone
};
// Get all available timezones with their current offsets
function getAvailableTimezones() {
    var allCities = [];
    var seenTimezones = new Set();
    // Track unique city-timezone combinations to avoid duplicates
    var seenCityTimezones = new Set();
    // Helper function to add a city to the list
    var addCity = function (id, info) {
        var now = luxon_1.DateTime.now();
        var zoned = now.setZone(id);
        if (!zoned.isValid) {
            console.error("Invalid timezone: ".concat(id), zoned.invalidReason);
            return;
        }
        // Create a unique key for this city-timezone combination
        var cityTimezoneKey = "".concat(info.name, "-").concat(info.country, "-").concat(id);
        // Skip if we've already added this city with this timezone
        if (seenCityTimezones.has(cityTimezoneKey)) {
            return;
        }
        allCities.push({
            id: id,
            name: "".concat(info.country, "/").concat(info.name),
            city: info.name,
            country: info.country,
            population: info.population,
            offset: zoned.offset
        });
        seenTimezones.add(id);
        seenCityTimezones.add(cityTimezoneKey);
    };
    // Add Chinese cities (all using Asia/Shanghai timezone)
    chinaCities.forEach(function (city) {
        addCity('Asia/Shanghai', city);
    });
    // Add all other global cities
    Object.entries(globalCities).forEach(function (_a) {
        var info = _a[1];
        // Use the timezone property from the city info
        var timezone = info.timezone;
        if (timezone && !seenTimezones.has(timezone)) {
            addCity(timezone, info);
        }
    });
    // Add all Canadian cities
    Object.entries(canadianCities).forEach(function (_a) {
        var timezone = _a[0], cities = _a[1];
        cities.forEach(function (city) {
            addCity(timezone, city);
        });
    });
    // Add all European cities
    Object.entries(europeanCities).forEach(function (_a) {
        var timezone = _a[0], cities = _a[1];
        cities.forEach(function (city) {
            addCity(timezone, city);
        });
    });
    // Add all South American cities
    Object.entries(southAmericanCities).forEach(function (_a) {
        var timezone = _a[0], cities = _a[1];
        cities.forEach(function (city) {
            addCity(timezone, city);
        });
    });
    // Add all Indian cities
    Object.entries(indianCities).forEach(function (_a) {
        var timezone = _a[0], cities = _a[1];
        cities.forEach(function (city) {
            addCity(timezone, city);
        });
    });
    // Add all South Asian cities
    Object.entries(southAsianCities).forEach(function (_a) {
        var timezone = _a[0], cities = _a[1];
        cities.forEach(function (city) {
            addCity(timezone, city);
        });
    });
    // Add all Middle Eastern cities
    Object.entries(middleEastCities).forEach(function (_a) {
        var timezone = _a[0], cities = _a[1];
        cities.forEach(function (city) {
            addCity(timezone, city);
        });
    });
    // Add all Australian cities
    Object.entries(australianCities).forEach(function (_a) {
        var timezone = _a[0], cities = _a[1];
        cities.forEach(function (city) {
            addCity(timezone, city);
        });
    });
    // Add all US cities
    Object.entries(usCities).forEach(function (_a) {
        var timezone = _a[0], cities = _a[1];
        cities.forEach(function (city) {
            addCity(timezone, city);
        });
    });
    // Sort by population
    return allCities.sort(function (a, b) { return b.population - a.population; });
}
// Format the timezone name with city and offset
function formatTimezoneName(timezone) {
    if (typeof timezone.offset !== 'number' || isNaN(timezone.offset)) {
        console.error('Invalid offset for timezone:', timezone);
        return "".concat(timezone.country, "/").concat(timezone.city);
    }
    var offsetHours = Math.floor(Math.abs(timezone.offset) / 60);
    var offsetMinutes = Math.abs(timezone.offset) % 60;
    var offsetSign = timezone.offset >= 0 ? '+' : '-';
    var offsetString = "".concat(offsetSign).concat(offsetHours.toString().padStart(2, '0'), ":").concat(offsetMinutes.toString().padStart(2, '0'));
    return "".concat(timezone.country, "/").concat(timezone.city, " (UTC").concat(offsetString, ")");
}
