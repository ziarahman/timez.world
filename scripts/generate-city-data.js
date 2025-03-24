const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// This is a placeholder for the actual city data
// In production, we would fetch this from GeoNames or similar service
const generateCityData = () => {
  const cities = [
    // Example format for each city:
    {
      name: 'Toronto',
      country: 'Canada',
      population: 2731571,
      timezone: 'America/Toronto',
      lat: 43.7001,
      lng: -79.4163,
    }
    // ... more cities would be added here
  ];

  return cities;
};

const main = async () => {
  const cities = generateCityData();
  
  // Convert to JSON
  const jsonData = JSON.stringify(cities);
  
  // Compress the data
  const compressed = zlib.gzipSync(jsonData);
  
  // Write to public directory
  const outputPath = path.join(__dirname, '../public/data');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(outputPath, 'world-cities.json.gz'),
    compressed
  );
  
  console.log('City data generated and compressed successfully!');
};

main().catch(console.error);
