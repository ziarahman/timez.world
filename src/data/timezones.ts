import { DateTime } from 'luxon'
import { CityInfo, Timezone } from '../types'

// Interface for city information with timezone property
interface CityInfoWithTimezone extends CityInfo {
  timezone: string; // Valid IANA timezone identifier
}

const WINTER_MONTH = 1
const SUMMER_MONTH = 7

const buildOffsetAliases = (offsetMinutes: number): string[] => {
  if (!Number.isFinite(offsetMinutes)) {
    return []
  }

  const aliases = new Set<string>()

  if (offsetMinutes === 0) {
    ;[
      'UTC',
      'GMT',
      'UTC+0',
      'UTC-0',
      'UTC+00',
      'UTC-00',
      'UTC+00:00',
      'UTC-00:00',
      'GMT+0',
      'GMT-0',
      'GMT+00',
      'GMT-00',
      'GMT+00:00',
      'GMT-00:00'
    ].forEach(alias => aliases.add(alias))
    return Array.from(aliases)
  }

  const sign = offsetMinutes >= 0 ? '+' : '-'
  const absoluteMinutes = Math.abs(offsetMinutes)
  const hours = Math.floor(absoluteMinutes / 60)
  const minutes = absoluteMinutes % 60
  const hourVariants = [hours.toString(), hours.toString().padStart(2, '0')]
  const minuteString = minutes.toString().padStart(2, '0')

  hourVariants.forEach(hour => {
    aliases.add(`UTC${sign}${hour}`)
    aliases.add(`GMT${sign}${hour}`)

    const offsetWithColon = `${hour}:${minuteString}`
    aliases.add(`UTC${sign}${offsetWithColon}`)
    aliases.add(`GMT${sign}${offsetWithColon}`)
  })

  return Array.from(aliases)
}

export const generateTimezoneAliases = (timezoneId: string): string[] => {
  const aliases = new Set<string>()

  if (!timezoneId) {
    return []
  }

  aliases.add(timezoneId)

  const sampleDates = [
    DateTime.fromObject({ year: DateTime.utc().year, month: WINTER_MONTH, day: 1 }, { zone: timezoneId }),
    DateTime.fromObject({ year: DateTime.utc().year, month: SUMMER_MONTH, day: 1 }, { zone: timezoneId })
  ]

  sampleDates.forEach(dateTime => {
    if (!dateTime.isValid) {
      return
    }

    const abbreviation = dateTime.toFormat('ZZZZ')
    if (abbreviation && abbreviation !== 'UTC' && abbreviation !== 'GMT') {
      aliases.add(abbreviation.toUpperCase())
    }

    const offsetNameShort = dateTime.offsetNameShort
    if (offsetNameShort && offsetNameShort.toUpperCase() !== 'UTC' && offsetNameShort.toUpperCase() !== 'GMT') {
      aliases.add(offsetNameShort.toUpperCase())
    }

    const offsetNameLong = dateTime.offsetNameLong
    if (offsetNameLong) {
      aliases.add(offsetNameLong)
      aliases.add(offsetNameLong.toUpperCase())
    }

    buildOffsetAliases(dateTime.offset).forEach(alias => aliases.add(alias))
  })

  return Array.from(aliases)
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

// Hawaii cities by timezone
const hawaiiCities: Record<string, CityInfoWithTimezone[]> = {
  'Pacific/Honolulu': [
    { name: 'Honolulu', country: 'United States', population: 345064, timezone: 'Pacific/Honolulu' },
    { name: 'Hilo', country: 'United States', population: 45000, timezone: 'Pacific/Honolulu' },
    { name: 'Kailua', country: 'United States', population: 40000, timezone: 'Pacific/Honolulu' },
  ],
};

// Alaska cities by timezone
const alaskaCities: Record<string, CityInfoWithTimezone[]> = {
  'America/Anchorage': [
    { name: 'Anchorage', country: 'United States', population: 291247, timezone: 'America/Anchorage' },
    { name: 'Fairbanks', country: 'United States', population: 31516, timezone: 'America/Anchorage' },
    { name: 'Juneau', country: 'United States', population: 31275, timezone: 'America/Anchorage' },
  ],
};

// Antarctica cities by timezone
const antarcticaCities: Record<string, CityInfoWithTimezone[]> = {
  'Antarctica/Palmer': [
    { name: 'Palmer Station', country: 'Antarctica', population: 0, timezone: 'Antarctica/Palmer' },
  ],
  'Antarctica/McMurdo': [
    { name: 'McMurdo Station', country: 'Antarctica', population: 1200, timezone: 'Antarctica/McMurdo' },
  ],
  'Antarctica/Rothera': [
    { name: 'Rothera Research Station', country: 'Antarctica', population: 100, timezone: 'Antarctica/Rothera' },
  ],
};

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

// Asian cities by timezone
const asianCities: Record<string, CityInfoWithTimezone[]> = {
  'Asia/Shanghai': [
    { name: 'Shanghai', country: 'China', population: 26317104, timezone: 'Asia/Shanghai' },
    { name: 'Beijing', country: 'China', population: 21893095, timezone: 'Asia/Shanghai' },
    { name: 'Guangzhou', country: 'China', population: 18676605, timezone: 'Asia/Shanghai' },
    { name: 'Shenzhen', country: 'China', population: 17500000, timezone: 'Asia/Shanghai' },
    { name: 'Chengdu', country: 'China', population: 16330000, timezone: 'Asia/Shanghai' },
  ],
  'Asia/Urumqi': [
    { name: 'Ürümqi', country: 'China', population: 3540000, timezone: 'Asia/Urumqi' },
    { name: 'Kashgar', country: 'China', population: 506640, timezone: 'Asia/Urumqi' },
  ],
  'Asia/Harbin': [
    { name: 'Harbin', country: 'China', population: 10636000, timezone: 'Asia/Harbin' },
    { name: 'Changchun', country: 'China', population: 7674439, timezone: 'Asia/Harbin' },
  ],
  'Asia/Chongqing': [
    { name: 'Chongqing', country: 'China', population: 31020000, timezone: 'Asia/Chongqing' },
    { name: 'Kunming', country: 'China', population: 8460000, timezone: 'Asia/Chongqing' },
  ],
  'Asia/Kashgar': [
    { name: 'Hotan', country: 'China', population: 322300, timezone: 'Asia/Kashgar' },
    { name: 'Aksu', country: 'China', population: 573000, timezone: 'Asia/Kashgar' },
  ],
  'Asia/Tokyo': [
    { name: 'Tokyo', country: 'Japan', population: 37400068, timezone: 'Asia/Tokyo' },
    { name: 'Osaka', country: 'Japan', population: 19222665, timezone: 'Asia/Tokyo' },
    { name: 'Nagoya', country: 'Japan', population: 9220000, timezone: 'Asia/Tokyo' },
    { name: 'Sapporo', country: 'Japan', population: 1952356, timezone: 'Asia/Tokyo' },
    { name: 'Fukuoka', country: 'Japan', population: 1536000, timezone: 'Asia/Tokyo' },
  ],
  'Asia/Seoul': [
    { name: 'Seoul', country: 'South Korea', population: 9776000, timezone: 'Asia/Seoul' },
    { name: 'Busan', country: 'South Korea', population: 3448737, timezone: 'Asia/Seoul' },
    { name: 'Incheon', country: 'South Korea', population: 2957026, timezone: 'Asia/Seoul' },
  ],
  'Asia/Bangkok': [
    { name: 'Bangkok', country: 'Thailand', population: 10539000, timezone: 'Asia/Bangkok' },
    { name: 'Chiang Mai', country: 'Thailand', population: 127240, timezone: 'Asia/Bangkok' },
  ],
  'Asia/Kuala_Lumpur': [
    { name: 'Kuala Lumpur', country: 'Malaysia', population: 8285000, timezone: 'Asia/Kuala_Lumpur' },
    { name: 'George Town', country: 'Malaysia', population: 708127, timezone: 'Asia/Kuala_Lumpur' },
  ],
  'Asia/Singapore': [
    { name: 'Singapore', country: 'Singapore', population: 5638700, timezone: 'Asia/Singapore' },
  ],
  'Asia/Jakarta': [
    { name: 'Jakarta', country: 'Indonesia', population: 10770487, timezone: 'Asia/Jakarta' },
    { name: 'Surabaya', country: 'Indonesia', population: 2890000, timezone: 'Asia/Jakarta' },
    { name: 'Bandung', country: 'Indonesia', population: 2394000, timezone: 'Asia/Jakarta' },
  ],
  'Asia/Manila': [
    { name: 'Manila', country: 'Philippines', population: 1780148, timezone: 'Asia/Manila' },
    { name: 'Quezon City', country: 'Philippines', population: 2936116, timezone: 'Asia/Manila' },
    { name: 'Davao City', country: 'Philippines', population: 1632991, timezone: 'Asia/Manila' },
  ],
  'Asia/Hong_Kong': [
    { name: 'Hong Kong', country: 'Hong Kong', population: 7451000, timezone: 'Asia/Hong_Kong' },
  ],
  'Asia/Taipei': [
    { name: 'Taipei', country: 'Taiwan', population: 2646204, timezone: 'Asia/Taipei' },
    { name: 'Kaohsiung', country: 'Taiwan', population: 2778918, timezone: 'Asia/Taipei' },
    { name: 'Taichung', country: 'Taiwan', population: 2820973, timezone: 'Asia/Taipei' },
  ],
  'Asia/Yangon': [
    { name: 'Yangon', country: 'Myanmar', population: 5441000, timezone: 'Asia/Yangon' },
    { name: 'Mandalay', country: 'Myanmar', population: 1225546, timezone: 'Asia/Yangon' },
  ],
  'Asia/Dhaka': [
    { name: 'Dhaka', country: 'Bangladesh', population: 8906039, timezone: 'Asia/Dhaka' },
    { name: 'Chittagong', country: 'Bangladesh', population: 2581643, timezone: 'Asia/Dhaka' },
  ],
  'Asia/Ho_Chi_Minh': [
    { name: 'Ho Chi Minh City', country: 'Vietnam', population: 9000000, timezone: 'Asia/Ho_Chi_Minh' },
    { name: 'Hanoi', country: 'Vietnam', population: 8000000, timezone: 'Asia/Ho_Chi_Minh' },
  ],
  'Asia/Karachi': [
    { name: 'Karachi', country: 'Pakistan', population: 15741000, timezone: 'Asia/Karachi' },
    { name: 'Lahore', country: 'Pakistan', population: 12188000, timezone: 'Asia/Karachi' },
    { name: 'Islamabad', country: 'Pakistan', population: 1014825, timezone: 'Asia/Karachi' },
  ],
  'Asia/Tashkent': [
    { name: 'Tashkent', country: 'Uzbekistan', population: 2485900, timezone: 'Asia/Tashkent' },
    { name: 'Samarkand', country: 'Uzbekistan', population: 504423, timezone: 'Asia/Tashkent' },
  ],
  'Asia/Almaty': [
    { name: 'Almaty', country: 'Kazakhstan', population: 2000900, timezone: 'Asia/Almaty' },
    { name: 'Nur-Sultan', country: 'Kazakhstan', population: 1190000, timezone: 'Asia/Almaty' },
  ],
  'Asia/Dushanbe': [
    { name: 'Dushanbe', country: 'Tajikistan', population: 863400, timezone: 'Asia/Dushanbe' },
  ],
  'Asia/Ashgabat': [
    { name: 'Ashgabat', country: 'Turkmenistan', population: 1031992, timezone: 'Asia/Ashgabat' },
  ],
  'Asia/Bishkek': [
    { name: 'Bishkek', country: 'Kyrgyzstan', population: 1024000, timezone: 'Asia/Bishkek' },
  ],
  'Asia/Ulaanbaatar': [
    { name: 'Ulaanbaatar', country: 'Mongolia', population: 1488000, timezone: 'Asia/Ulaanbaatar' },
  ],
};

// Russian cities by timezone
const russianCities: Record<string, CityInfoWithTimezone[]> = {
  'Europe/Moscow': [
    { name: 'Moscow', country: 'Russia', population: 12506468, timezone: 'Europe/Moscow' },
    { name: 'Saint Petersburg', country: 'Russia', population: 5383890, timezone: 'Europe/Moscow' },
    { name: 'Nizhny Novgorod', country: 'Russia', population: 1250615, timezone: 'Europe/Moscow' },
  ],
  'Asia/Yekaterinburg': [
    { name: 'Yekaterinburg', country: 'Russia', population: 1483119, timezone: 'Asia/Yekaterinburg' },
  ],
  'Asia/Novosibirsk': [
    { name: 'Novosibirsk', country: 'Russia', population: 1620162, timezone: 'Asia/Novosibirsk' },
  ],
  'Asia/Vladivostok': [
    { name: 'Vladivostok', country: 'Russia', population: 600378, timezone: 'Asia/Vladivostok' },
  ],
};

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
  'Asia/Jerusalem': [
    { name: 'Tel Aviv', country: 'Israel', population: 443900, timezone: 'Asia/Jerusalem' },
    { name: 'Jerusalem', country: 'Israel', population: 882700, timezone: 'Asia/Jerusalem' },
  ],
  'Asia/Gaza': [
    { name: 'Gaza', country: 'Palestine', population: 570000, timezone: 'Asia/Gaza' },
  ],
  'Africa/Cairo': [
    { name: 'Cairo', country: 'Egypt', population: 10852000, timezone: 'Africa/Cairo' },
    { name: 'Alexandria', country: 'Egypt', population: 5200000, timezone: 'Africa/Cairo' },
    { name: 'Giza', country: 'Egypt', population: 4775000, timezone: 'Africa/Cairo' },
  ],
  'Africa/Khartoum': [
    { name: 'Khartoum', country: 'Sudan', population: 5124600, timezone: 'Africa/Khartoum' },
  ],
  'Africa/Mogadishu': [
    { name: 'Mogadishu', country: 'Somalia', population: 2587181, timezone: 'Africa/Mogadishu' },
  ],
  'Asia/Aden': [
    { name: 'Sanaa', country: 'Yemen', population: 4607500, timezone: 'Asia/Aden' },
  ],
  'Africa/Asmara': [
    { name: 'Asmara', country: 'Eritrea', population: 1023000, timezone: 'Africa/Asmara' },
  ],
  'Africa/Djibouti': [
    { name: 'Djibouti', country: 'Djibouti', population: 623891, timezone: 'Africa/Djibouti' },
  ],
  'Africa/Nairobi': [
    { name: 'Nairobi', country: 'Kenya', population: 4550000, timezone: 'Africa/Nairobi' },
  ],
  'Africa/Kampala': [
    { name: 'Kampala', country: 'Uganda', population: 1659000, timezone: 'Africa/Kampala' },
  ],
  'Africa/Dar_es_Salaam': [
    { name: 'Dar es Salaam', country: 'Tanzania', population: 6794000, timezone: 'Africa/Dar_es_Salaam' },
  ],
  'Africa/Casablanca': [
    { name: 'Casablanca', country: 'Morocco', population: 3359818, timezone: 'Africa/Casablanca' },
  ],
  'Africa/Algiers': [
    { name: 'Algiers', country: 'Algeria', population: 3518000, timezone: 'Africa/Algiers' },
  ],
  'Africa/Tunis': [
    { name: 'Tunis', country: 'Tunisia', population: 728000, timezone: 'Africa/Tunis' },
  ],
  'Africa/Tripoli': [
    { name: 'Tripoli', country: 'Libya', population: 1110000, timezone: 'Africa/Tripoli' },
  ],
}

// Oceania cities by timezone
const oceaniaCities: Record<string, CityInfoWithTimezone[]> = {
  'Australia/Sydney': [
    { name: 'Sydney', country: 'Australia', population: 5312163, timezone: 'Australia/Sydney' },
    { name: 'Melbourne', country: 'Australia', population: 5078193, timezone: 'Australia/Sydney' },
    { name: 'Canberra', country: 'Australia', population: 462213, timezone: 'Australia/Sydney' },
  ],
  'Australia/Brisbane': [
    { name: 'Brisbane', country: 'Australia', population: 2514184, timezone: 'Australia/Brisbane' },
  ],
  'Australia/Perth': [
    { name: 'Perth', country: 'Australia', population: 2117921, timezone: 'Australia/Perth' },
  ],
  'Australia/Adelaide': [
    { name: 'Adelaide', country: 'Australia', population: 1372200, timezone: 'Australia/Adelaide' },
  ],
  'Pacific/Auckland': [
    { name: 'Auckland', country: 'New Zealand', population: 1657000, timezone: 'Pacific/Auckland' },
    { name: 'Wellington', country: 'New Zealand', population: 215100, timezone: 'Pacific/Auckland' },
    { name: 'Christchurch', country: 'New Zealand', population: 383200, timezone: 'Pacific/Auckland' },
  ],
  'Pacific/Port_Moresby': [
    { name: 'Port Moresby', country: 'Papua New Guinea', population: 364125, timezone: 'Pacific/Port_Moresby' },
  ],
  'Pacific/Suva': [
    { name: 'Suva', country: 'Fiji', population: 88500, timezone: 'Pacific/Suva' },
  ],
  'Pacific/Honolulu': [
    { name: 'Honolulu', country: 'United States', population: 345064, timezone: 'Pacific/Honolulu' },
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
  'Europe/Oslo': [
    { name: 'Oslo', country: 'Norway', population: 698660, timezone: 'Europe/Oslo' },
    { name: 'Bergen', country: 'Norway', population: 283929, timezone: 'Europe/Oslo' },
    { name: 'Trondheim', country: 'Norway', population: 205163, timezone: 'Europe/Oslo' },
  ],
  'Europe/Lisbon': [
    { name: 'Lisbon', country: 'Portugal', population: 544851, timezone: 'Europe/Lisbon' },
    { name: 'Porto', country: 'Portugal', population: 237591, timezone: 'Europe/Lisbon' },
    { name: 'Braga', country: 'Portugal', population: 193333, timezone: 'Europe/Lisbon' },
  ],
  'Europe/Amsterdam': [
    { name: 'Amsterdam', country: 'Netherlands', population: 872757, timezone: 'Europe/Amsterdam' },
    { name: 'Rotterdam', country: 'Netherlands', population: 651446, timezone: 'Europe/Amsterdam' },
    { name: 'The Hague', country: 'Netherlands', population: 545863, timezone: 'Europe/Amsterdam' },
  ],
  'Europe/Brussels': [
    { name: 'Brussels', country: 'Belgium', population: 185103, timezone: 'Europe/Brussels' },
    { name: 'Antwerp', country: 'Belgium', population: 529247, timezone: 'Europe/Brussels' },
    { name: 'Ghent', country: 'Belgium', population: 263927, timezone: 'Europe/Brussels' },
  ],
  'Europe/Stockholm': [
    { name: 'Stockholm', country: 'Sweden', population: 975551, timezone: 'Europe/Stockholm' },
    { name: 'Gothenburg', country: 'Sweden', population: 583056, timezone: 'Europe/Stockholm' },
    { name: 'Malmö', country: 'Sweden', population: 347949, timezone: 'Europe/Stockholm' },
  ],
  'Europe/Copenhagen': [
    { name: 'Copenhagen', country: 'Denmark', population: 794128, timezone: 'Europe/Copenhagen' },
    { name: 'Aarhus', country: 'Denmark', population: 280534, timezone: 'Europe/Copenhagen' },
    { name: 'Odense', country: 'Denmark', population: 180760, timezone: 'Europe/Copenhagen' },
  ],
  'Europe/Helsinki': [
    { name: 'Helsinki', country: 'Finland', population: 656229, timezone: 'Europe/Helsinki' },
    { name: 'Espoo', country: 'Finland', population: 292913, timezone: 'Europe/Helsinki' },
    { name: 'Tampere', country: 'Finland', population: 244029, timezone: 'Europe/Helsinki' },
  ],
  'Europe/Vienna': [
    { name: 'Vienna', country: 'Austria', population: 1911191, timezone: 'Europe/Vienna' },
    { name: 'Graz', country: 'Austria', population: 291890, timezone: 'Europe/Vienna' },
    { name: 'Linz', country: 'Austria', population: 204846, timezone: 'Europe/Vienna' },
  ],
  'Europe/Budapest': [
    { name: 'Budapest', country: 'Hungary', population: 1752286, timezone: 'Europe/Budapest' },
    { name: 'Debrecen', country: 'Hungary', population: 202214, timezone: 'Europe/Budapest' },
    { name: 'Szeged', country: 'Hungary', population: 161921, timezone: 'Europe/Budapest' },
  ],
  'Europe/Prague': [
    { name: 'Prague', country: 'Czech Republic', population: 1301132, timezone: 'Europe/Prague' },
    { name: 'Brno', country: 'Czech Republic', population: 380681, timezone: 'Europe/Prague' },
    { name: 'Ostrava', country: 'Czech Republic', population: 287968, timezone: 'Europe/Prague' },
  ],
  'Europe/Zurich': [
    { name: 'Zurich', country: 'Switzerland', population: 434008, timezone: 'Europe/Zurich' },
    { name: 'Geneva', country: 'Switzerland', population: 201818, timezone: 'Europe/Zurich' },
    { name: 'Basel', country: 'Switzerland', population: 178500, timezone: 'Europe/Zurich' },
  ],
  'Europe/Athens': [
    { name: 'Athens', country: 'Greece', population: 664046, timezone: 'Europe/Athens' },
    { name: 'Thessaloniki', country: 'Greece', population: 315196, timezone: 'Europe/Athens' },
    { name: 'Patras', country: 'Greece', population: 167446, timezone: 'Europe/Athens' },
  ],
  'Europe/Dublin': [
    { name: 'Dublin', country: 'Ireland', population: 1173179, timezone: 'Europe/Dublin' },
    { name: 'Cork', country: 'Ireland', population: 210000, timezone: 'Europe/Dublin' },
    { name: 'Limerick', country: 'Ireland', population: 94900, timezone: 'Europe/Dublin' },
  ],
  'Europe/Sofia': [
    { name: 'Sofia', country: 'Bulgaria', population: 1241675, timezone: 'Europe/Sofia' },
    { name: 'Plovdiv', country: 'Bulgaria', population: 346893, timezone: 'Europe/Sofia' },
    { name: 'Varna', country: 'Bulgaria', population: 335177, timezone: 'Europe/Sofia' },
  ],
  'Europe/Belgrade': [
    { name: 'Belgrade', country: 'Serbia', population: 1166763, timezone: 'Europe/Belgrade' },
    { name: 'Novi Sad', country: 'Serbia', population: 341625, timezone: 'Europe/Belgrade' },
    { name: 'Niš', country: 'Serbia', population: 260237, timezone: 'Europe/Belgrade' },
  ],
  'Europe/Zagreb': [
    { name: 'Zagreb', country: 'Croatia', population: 806341, timezone: 'Europe/Zagreb' },
    { name: 'Split', country: 'Croatia', population: 178102, timezone: 'Europe/Zagreb' },
    { name: 'Rijeka', country: 'Croatia', population: 128624, timezone: 'Europe/Zagreb' },
  ],
  'Europe/Bratislava': [
    { name: 'Bratislava', country: 'Slovakia', population: 437725, timezone: 'Europe/Bratislava' },
    { name: 'Košice', country: 'Slovakia', population: 238593, timezone: 'Europe/Bratislava' },
    { name: 'Prešov', country: 'Slovakia', population: 89162, timezone: 'Europe/Bratislava' },
  ],
  'Europe/Tallinn': [
    { name: 'Tallinn', country: 'Estonia', population: 437619, timezone: 'Europe/Tallinn' },
    { name: 'Tartu', country: 'Estonia', population: 91407, timezone: 'Europe/Tallinn' },
  ],
  'Europe/Riga': [
    { name: 'Riga', country: 'Latvia', population: 632614, timezone: 'Europe/Riga' },
    { name: 'Daugavpils', country: 'Latvia', population: 82000, timezone: 'Europe/Riga' },
  ],
  'Europe/Vilnius': [
    { name: 'Vilnius', country: 'Lithuania', population: 588412, timezone: 'Europe/Vilnius' },
    { name: 'Kaunas', country: 'Lithuania', population: 295269, timezone: 'Europe/Vilnius' },
  ],
  'Europe/Ljubljana': [
    { name: 'Ljubljana', country: 'Slovenia', population: 295504, timezone: 'Europe/Ljubljana' },
    { name: 'Maribor', country: 'Slovenia', population: 112325, timezone: 'Europe/Ljubljana' },
  ],
  'Europe/Tirana': [
    { name: 'Tirana', country: 'Albania', population: 418495, timezone: 'Europe/Tirana' },
    { name: 'Durrës', country: 'Albania', population: 175110, timezone: 'Europe/Tirana' },
  ],
  'Europe/Skopje': [
    { name: 'Skopje', country: 'North Macedonia', population: 544086, timezone: 'Europe/Skopje' },
    { name: 'Bitola', country: 'North Macedonia', population: 74450, timezone: 'Europe/Skopje' },
  ],
  'Europe/Podgorica': [
    { name: 'Podgorica', country: 'Montenegro', population: 185937, timezone: 'Europe/Podgorica' },
    { name: 'Nikšić', country: 'Montenegro', population: 56870, timezone: 'Europe/Podgorica' },
  ],
  'Europe/Sarajevo': [
    { name: 'Sarajevo', country: 'Bosnia and Herzegovina', population: 275524, timezone: 'Europe/Sarajevo' },
    { name: 'Banja Luka', country: 'Bosnia and Herzegovina', population: 185042, timezone: 'Europe/Sarajevo' },
  ],
  'Europe/Chisinau': [
    { name: 'Chisinau', country: 'Moldova', population: 532513, timezone: 'Europe/Chisinau' },
    { name: 'Tiraspol', country: 'Moldova', population: 134827, timezone: 'Europe/Chisinau' },
  ],
  'Europe/Reykjavik': [
    { name: 'Reykjavik', country: 'Iceland', population: 131136, timezone: 'Europe/Reykjavik' },
  ],
  'Europe/Andorra': [
    { name: 'Andorra la Vella', country: 'Andorra', population: 22615, timezone: 'Europe/Andorra' },
  ],
  'Europe/Monaco': [
    { name: 'Monaco', country: 'Monaco', population: 38300, timezone: 'Europe/Monaco' },
  ],
  'Europe/San_Marino': [
    { name: 'San Marino', country: 'San Marino', population: 33574, timezone: 'Europe/San_Marino' },
  ],
  'Europe/Vatican': [
    { name: 'Vatican City', country: 'Vatican', population: 825, timezone: 'Europe/Vatican' },
  ],
}

// GMT/UTC timezones
const gmtTimezones: Record<string, CityInfoWithTimezone[]> = {
  'Etc/GMT+12': [
    { name: 'GMT-12', country: 'TZ', population: 0, timezone: 'Etc/GMT+12' },
  ],
  'Etc/GMT+11': [
    { name: 'GMT-11', country: 'TZ', population: 0, timezone: 'Etc/GMT+11' },
  ],
  'Etc/GMT+10': [
    { name: 'GMT-10', country: 'TZ', population: 0, timezone: 'Etc/GMT+10' },
  ],
  'Etc/GMT+9': [
    { name: 'GMT-9', country: 'TZ', population: 0, timezone: 'Etc/GMT+9' },
  ],
  'Etc/GMT+8': [
    { name: 'GMT-8', country: 'TZ', population: 0, timezone: 'Etc/GMT+8' },
  ],
  'Etc/GMT+7': [
    { name: 'GMT-7', country: 'TZ', population: 0, timezone: 'Etc/GMT+7' },
  ],
  'Etc/GMT+6': [
    { name: 'GMT-6', country: 'TZ', population: 0, timezone: 'Etc/GMT+6' },
  ],
  'Etc/GMT+5': [
    { name: 'GMT-5', country: 'TZ', population: 0, timezone: 'Etc/GMT+5' },
  ],
  'Etc/GMT+4': [
    { name: 'GMT-4', country: 'TZ', population: 0, timezone: 'Etc/GMT+4' },
  ],
  'Etc/GMT+3': [
    { name: 'GMT-3', country: 'TZ', population: 0, timezone: 'Etc/GMT+3' },
  ],
  'Etc/GMT+2': [
    { name: 'GMT-2', country: 'TZ', population: 0, timezone: 'Etc/GMT+2' },
  ],
  'Etc/GMT+1': [
    { name: 'GMT-1', country: 'TZ', population: 0, timezone: 'Etc/GMT+1' },
  ],
  'Etc/GMT': [
    { name: 'GMT/UTC', country: 'TZ', population: 0, timezone: 'Etc/GMT' },
  ],
  'Etc/GMT-1': [
    { name: 'GMT+1', country: 'TZ', population: 0, timezone: 'Etc/GMT-1' },
  ],
  'Etc/GMT-2': [
    { name: 'GMT+2', country: 'TZ', population: 0, timezone: 'Etc/GMT-2' },
  ],
  'Etc/GMT-3': [
    { name: 'GMT+3', country: 'TZ', population: 0, timezone: 'Etc/GMT-3' },
  ],
  'Etc/GMT-4': [
    { name: 'GMT+4', country: 'TZ', population: 0, timezone: 'Etc/GMT-4' },
  ],
  'Etc/GMT-5': [
    { name: 'GMT+5', country: 'TZ', population: 0, timezone: 'Etc/GMT-5' },
  ],
  'Etc/GMT-6': [
    { name: 'GMT+6', country: 'TZ', population: 0, timezone: 'Etc/GMT-6' },
  ],
  'Etc/GMT-7': [
    { name: 'GMT+7', country: 'TZ', population: 0, timezone: 'Etc/GMT-7' },
  ],
  'Etc/GMT-8': [
    { name: 'GMT+8', country: 'TZ', population: 0, timezone: 'Etc/GMT-8' },
  ],
  'Etc/GMT-9': [
    { name: 'GMT+9', country: 'TZ', population: 0, timezone: 'Etc/GMT-9' },
  ],
  'Etc/GMT-10': [
    { name: 'GMT+10', country: 'TZ', population: 0, timezone: 'Etc/GMT-10' },
  ],
  'Etc/GMT-11': [
    { name: 'GMT+11', country: 'TZ', population: 0, timezone: 'Etc/GMT-11' },
  ],
  'Etc/GMT-12': [
    { name: 'GMT+12', country: 'TZ', population: 0, timezone: 'Etc/GMT-12' },
  ],
  'Etc/GMT-13': [
    { name: 'GMT+13', country: 'TZ', population: 0, timezone: 'Etc/GMT-13' },
  ],
  'Etc/GMT-14': [
    { name: 'GMT+14', country: 'TZ', population: 0, timezone: 'Etc/GMT-14' },
  ],
};

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
    ...Object.values(hawaiiCities).flat(),
    ...Object.values(alaskaCities).flat(),
    ...Object.values(antarcticaCities).flat(),
    ...southAsianCities['Asia/Dhaka'],
    ...southAsianCities['Asia/Kathmandu'],
    ...southAsianCities['Asia/Colombo'],
    ...southAsianCities['Asia/Thimphu'],
    ...southAsianCities['Asia/Kabul'],
    ...Object.values(asianCities).flat(),
    ...Object.values(russianCities).flat(),
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
    ...middleEastCities['Asia/Jerusalem'],
    ...middleEastCities['Asia/Gaza'],
    ...middleEastCities['Africa/Cairo'],
    ...middleEastCities['Africa/Khartoum'],
    ...middleEastCities['Africa/Mogadishu'],
    ...middleEastCities['Asia/Aden'],
    ...middleEastCities['Africa/Asmara'],
    ...middleEastCities['Africa/Djibouti'],
    ...middleEastCities['Africa/Nairobi'],
    ...middleEastCities['Africa/Kampala'],
    ...middleEastCities['Africa/Dar_es_Salaam'],
    ...middleEastCities['Africa/Casablanca'],
    ...middleEastCities['Africa/Algiers'],
    ...middleEastCities['Africa/Tunis'],
    ...middleEastCities['Africa/Tripoli'],
    ...Object.values(oceaniaCities).flat(),
    ...Object.values(europeanCities).flat(),
    ...Object.values(gmtTimezones).flat(), // Include GMT/UTC timezones
  ];

  // Convert CityInfo to Timezone format
  return allCities.map(city => ({
    id: city.timezone,
    name: `${city.name}, ${city.country}`,
    city: city.name,
    country: city.country,
    timezone: city.timezone,
    aliases: generateTimezoneAliases(city.timezone),
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

  // Only show country if it exists and is not empty
  const countryDisplay = timezone.country ? `, ${timezone.country}` : '';

  return `${timezone.name}${countryDisplay} (${offsetSign}${offsetHoursStr}:${offsetMinutesStr.toString().padStart(2, '0')})`;
};
