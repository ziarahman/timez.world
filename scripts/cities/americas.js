export function generateAmericanCities() {
  // Helper function to generate city objects
  const city = (name, country, population, timezone, latitude, longitude) => ({
    name, country, population, timezone, latitude, longitude
  });

  return [
    // Additional US cities
    city('Nashville', 'USA', 670820, 'America/Chicago', 36.1627, -86.7816),
    city('Portland', 'USA', 654741, 'America/Los_Angeles', 45.5155, -122.6789),
    city('Oklahoma City', 'USA', 649021, 'America/Chicago', 35.4676, -97.5164),
    city('Las Vegas', 'USA', 641903, 'America/Los_Angeles', 36.1699, -115.1398),
    city('Louisville', 'USA', 617638, 'America/Kentucky/Louisville', 38.2527, -85.7585),
    city('Milwaukee', 'USA', 590157, 'America/Chicago', 43.0389, -87.9065),
    city('Albuquerque', 'USA', 564559, 'America/Denver', 35.0844, -106.6504),
    city('Tucson', 'USA', 548073, 'America/Phoenix', 32.2216, -110.9265),
    city('Fresno', 'USA', 542107, 'America/Los_Angeles', 36.7378, -119.7871),
    city('Sacramento', 'USA', 524943, 'America/Los_Angeles', 38.5816, -121.4944),
    city('Mesa', 'USA', 518012, 'America/Phoenix', 33.4152, -111.8315),
    city('Kansas City', 'USA', 508090, 'America/Chicago', 39.0997, -94.5786),
    city('Atlanta', 'USA', 506811, 'America/New_York', 33.7490, -84.3880),
    city('Omaha', 'USA', 486051, 'America/Chicago', 41.2565, -95.9345),
    city('Colorado Springs', 'USA', 478961, 'America/Denver', 38.8339, -104.8214),
    city('Raleigh', 'USA', 474069, 'America/New_York', 35.7796, -78.6382),
    city('Virginia Beach', 'USA', 459470, 'America/New_York', 36.8529, -75.9780),
    city('Minneapolis', 'USA', 429954, 'America/Chicago', 44.9778, -93.2650),
    city('Tulsa', 'USA', 413066, 'America/Chicago', 36.1540, -95.9928),
    city('Arlington', 'USA', 398854, 'America/Chicago', 32.7357, -97.1081),
    
    // Additional Canadian cities
    city('Winnipeg', 'Canada', 749607, 'America/Winnipeg', 49.8951, -97.1384),
    city('Hamilton', 'Canada', 536917, 'America/Toronto', 43.2557, -79.8711),
    city('Brampton', 'Canada', 593638, 'America/Toronto', 43.6833, -79.7667),
    city('Surrey', 'Canada', 517887, 'America/Vancouver', 49.1913, -122.8490),
    city('Halifax', 'Canada', 403131, 'America/Halifax', 44.6488, -63.5752),
    city('Laval', 'Canada', 422993, 'America/Toronto', 45.5833, -73.7500),
    city('Victoria', 'Canada', 92141, 'America/Vancouver', 48.4284, -123.3656),
    
    // Additional Mexican cities
    city('Ecatepec', 'Mexico', 1655015, 'America/Mexico_City', 19.6097, -99.0600),
    city('Guadalajara', 'Mexico', 1495182, 'America/Mexico_City', 20.6597, -103.3496),
    city('Puebla', 'Mexico', 1434062, 'America/Mexico_City', 19.0414, -98.2063),
    city('Ciudad Juárez', 'Mexico', 1321004, 'America/Chihuahua', 31.6904, -106.4245),
    city('Tijuana', 'Mexico', 1300983, 'America/Tijuana', 32.5149, -117.0382),
    city('León', 'Mexico', 1238962, 'America/Mexico_City', 21.1167, -101.6833),
    city('Monterrey', 'Mexico', 1135512, 'America/Monterrey', 25.6866, -100.3161),
    
    // Additional Brazilian cities
    city('Salvador', 'Brazil', 2886698, 'America/Bahia', -12.9714, -38.5014),
    city('Fortaleza', 'Brazil', 2686612, 'America/Fortaleza', -3.7172, -38.5433),
    city('Belo Horizonte', 'Brazil', 2513451, 'America/Sao_Paulo', -19.9167, -43.9345),
    city('Manaus', 'Brazil', 2219580, 'America/Manaus', -3.1019, -60.0250),
    city('Curitiba', 'Brazil', 1948626, 'America/Sao_Paulo', -25.4284, -49.2733),
    city('Recife', 'Brazil', 1653461, 'America/Recife', -8.0476, -34.8770),
    city('Porto Alegre', 'Brazil', 1484941, 'America/Sao_Paulo', -30.0346, -51.2177),
    
    // Additional cities in Argentina
    city('Córdoba', 'Argentina', 1391000, 'America/Argentina/Cordoba', -31.4167, -64.1833),
    city('Rosario', 'Argentina', 1193605, 'America/Argentina/Cordoba', -32.9468, -60.6393),
    city('Mendoza', 'Argentina', 937154, 'America/Argentina/Mendoza', -32.8908, -68.8272),
    city('La Plata', 'Argentina', 699523, 'America/Argentina/Buenos_Aires', -34.9215, -57.9545),
    
    // Additional cities in Colombia
    city('Medellín', 'Colombia', 2529403, 'America/Bogota', 6.2442, -75.5812),
    city('Cali', 'Colombia', 2401653, 'America/Bogota', 3.4516, -76.5320),
    city('Barranquilla', 'Colombia', 1232766, 'America/Bogota', 10.9639, -74.7964),
    city('Cartagena', 'Colombia', 1028736, 'America/Bogota', 10.3997, -75.5144),
    
    // Additional cities in Peru
    city('Lima', 'Peru', 8852000, 'America/Lima', -12.0464, -77.0428),
    city('Arequipa', 'Peru', 1008290, 'America/Lima', -16.4090, -71.5375),
    city('Trujillo', 'Peru', 935147, 'America/Lima', -8.1162, -79.0300),
    city('Chiclayo', 'Peru', 552508, 'America/Lima', -6.7764, -79.8444),
    
    // Additional cities in Chile
    city('Santiago', 'Chile', 6158080, 'America/Santiago', -33.4489, -70.6693),
    city('Valparaíso', 'Chile', 284630, 'America/Santiago', -33.0472, -71.6127),
    city('Concepción', 'Chile', 223574, 'America/Santiago', -36.8270, -73.0498),
    
    // Additional cities in Venezuela
    city('Caracas', 'Venezuela', 2082597, 'America/Caracas', 10.4806, -66.9036),
    city('Maracaibo', 'Venezuela', 1653211, 'America/Caracas', 10.6317, -71.6406),
    city('Valencia', 'Venezuela', 1385083, 'America/Caracas', 10.1667, -68.0000),
    
    // Additional cities in Ecuador
    city('Quito', 'Ecuador', 2011388, 'America/Guayaquil', -0.2299, -78.5249),
    city('Guayaquil', 'Ecuador', 2291158, 'America/Guayaquil', -2.1962, -79.8862),
    city('Cuenca', 'Ecuador', 329928, 'America/Guayaquil', -2.9001, -79.0059),
    // USA
    { name: 'Phoenix', country: 'USA', population: 1608139, timezone: 'America/Phoenix', latitude: 33.4484, longitude: -112.0740 },
    { name: 'Philadelphia', country: 'USA', population: 1603797, timezone: 'America/New_York', latitude: 39.9526, longitude: -75.1652 },
    { name: 'San Antonio', country: 'USA', population: 1547253, timezone: 'America/Chicago', latitude: 29.4241, longitude: -98.4936 },
    { name: 'San Diego', country: 'USA', population: 1423851, timezone: 'America/Los_Angeles', latitude: 32.7157, longitude: -117.1611 },
    { name: 'Dallas', country: 'USA', population: 1330612, timezone: 'America/Chicago', latitude: 32.7767, longitude: -96.7970 },
    { name: 'San Jose', country: 'USA', population: 1021795, timezone: 'America/Los_Angeles', latitude: 37.3382, longitude: -121.8863 },
    { name: 'Austin', country: 'USA', population: 961855, timezone: 'America/Chicago', latitude: 30.2672, longitude: -97.7431 },
    { name: 'Jacksonville', country: 'USA', population: 911507, timezone: 'America/New_York', latitude: 30.3322, longitude: -81.6557 },
    { name: 'Fort Worth', country: 'USA', population: 909585, timezone: 'America/Chicago', latitude: 32.7555, longitude: -97.3308 },
    { name: 'Columbus', country: 'USA', population: 898553, timezone: 'America/New_York', latitude: 39.9612, longitude: -82.9988 },
    
    // Canada
    { name: 'Ottawa', country: 'Canada', population: 934243, timezone: 'America/Toronto', latitude: 45.4215, longitude: -75.6972 },
    { name: 'Edmonton', country: 'Canada', population: 932546, timezone: 'America/Edmonton', latitude: 53.5461, longitude: -113.4938 },
    { name: 'Mississauga', country: 'Canada', population: 721599, timezone: 'America/Toronto', latitude: 43.5890, longitude: -79.6441 },
    { name: 'Winnipeg', country: 'Canada', population: 749607, timezone: 'America/Winnipeg', latitude: 49.8951, longitude: -97.1384 },
    { name: 'Quebec City', country: 'Canada', population: 531902, timezone: 'America/Toronto', latitude: 46.8139, longitude: -71.2080 },
    
    // Mexico
    { name: 'Puebla', country: 'Mexico', population: 1692181, timezone: 'America/Mexico_City', latitude: 19.0414, longitude: -98.2063 },
    { name: 'Tijuana', country: 'Mexico', population: 1810645, timezone: 'America/Tijuana', latitude: 32.5149, longitude: -117.0382 },
    { name: 'León', country: 'Mexico', population: 1579803, timezone: 'America/Mexico_City', latitude: 21.1167, longitude: -101.6833 },
    { name: 'Juárez', country: 'Mexico', population: 1512354, timezone: 'America/Chihuahua', latitude: 31.6904, longitude: -106.4245 },
    
    // Brazil
    { name: 'Salvador', country: 'Brazil', population: 2886698, timezone: 'America/Bahia', latitude: -12.9714, longitude: -38.5014 },
    { name: 'Fortaleza', country: 'Brazil', population: 2669342, timezone: 'America/Fortaleza', latitude: -3.7172, longitude: -38.5433 },
    { name: 'Curitiba', country: 'Brazil', population: 1948626, timezone: 'America/Sao_Paulo', latitude: -25.4290, longitude: -49.2671 },
    { name: 'Manaus', country: 'Brazil', population: 2219580, timezone: 'America/Manaus', latitude: -3.1190, longitude: -60.0217 },
    
    // Argentina
    { name: 'Córdoba', country: 'Argentina', population: 1391000, timezone: 'America/Argentina/Cordoba', latitude: -31.4167, longitude: -64.1833 },
    { name: 'Rosario', country: 'Argentina', population: 1193605, timezone: 'America/Argentina/Cordoba', latitude: -32.9468, longitude: -60.6393 },
    { name: 'Mendoza', country: 'Argentina', population: 937154, timezone: 'America/Argentina/Mendoza', latitude: -32.8908, longitude: -68.8272 },
    
    // Colombia
    { name: 'Medellín', country: 'Colombia', population: 2529403, timezone: 'America/Bogota', latitude: 6.2442, longitude: -75.5812 },
    { name: 'Cali', country: 'Colombia', population: 2401653, timezone: 'America/Bogota', latitude: 3.4516, longitude: -76.5320 },
    { name: 'Barranquilla', country: 'Colombia', population: 1232462, timezone: 'America/Bogota', latitude: 10.9639, longitude: -74.7964 },
    
    // Chile
    { name: 'Valparaíso', country: 'Chile', population: 284630, timezone: 'America/Santiago', latitude: -33.0472, longitude: -71.6127 },
    { name: 'Concepción', country: 'Chile', population: 223574, timezone: 'America/Santiago', latitude: -36.8270, longitude: -73.0498 }
  ];
}
