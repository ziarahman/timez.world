import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateAsianCities } from './cities/asia.js';
import { generateEuropeanCities } from './cities/europe.js';
import { generateAmericanCities } from './cities/americas.js';
import { generateOceaniaCities } from './cities/oceania.js';
import { generateAfricanCities } from './cities/africa.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load static cities to avoid duplicates
const staticCitiesFile = path.join(__dirname, '../src/data/timezones.ts');
const staticCitiesContent = fs.readFileSync(staticCitiesFile, 'utf8');
const staticCities = new Set();

// Extract city names from static cities file using regex
const cityRegex = /name: '([^']+)'/g;
let match;
while ((match = cityRegex.exec(staticCitiesContent)) !== null) {
  staticCities.add(match[1]);
}

console.log(`Loaded ${staticCities.size} static cities`);

// City data by region
const generateCities = () => ({
  asia: generateAsianCities(),
  europe: generateEuropeanCities(),
  americas: generateAmericanCities(),
  oceania: generateOceaniaCities(),
  africa: generateAfricanCities()
});

const main = async () => {
  try {
    console.log('Generating regional city data...');
    
    const cities = generateCities();
    const outputPath = path.join(__dirname, '../public/data/cities');
    
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }
    
    let totalCities = 0;
    for (const [region, regionCities] of Object.entries(cities)) {
      // Filter out static cities
      const filteredCities = regionCities.filter(city => !staticCities.has(city.name));
      
      fs.writeFileSync(
        path.join(outputPath, `${region}.json`),
        JSON.stringify(filteredCities, null, 2)
      );
      
      totalCities += filteredCities.length;
      console.log(`Generated ${region}.json with ${filteredCities.length} cities`);
    }
    
    console.log(`Total additional cities generated: ${totalCities}`);
  } catch (error) {
    console.error('Error generating city data:', error);
    process.exit(1);
  }
};

main();
