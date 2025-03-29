import { getAvailableTimezones } from '../src/data/timezones';

const cities = getAvailableTimezones();
console.log(`Total cities in timezones data: ${cities.length}`);
