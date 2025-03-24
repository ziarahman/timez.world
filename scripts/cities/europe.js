export function generateEuropeanCities() {
  // Helper function to generate city objects
  const city = (name, country, population, timezone, latitude, longitude) => ({
    name, country, population, timezone, latitude, longitude
  });

  return [
    // Additional UK cities
    city('Sheffield', 'UK', 584853, 'Europe/London', 53.3811, -1.4701),
    city('Leicester', 'UK', 552000, 'Europe/London', 52.6369, -1.1398),
    city('Cardiff', 'UK', 447287, 'Europe/London', 51.4816, -3.1791),
    city('Nottingham', 'UK', 321500, 'Europe/London', 52.9548, -1.1581),
    city('Newcastle', 'UK', 302820, 'Europe/London', 54.9783, -1.6178),
    city('Aberdeen', 'UK', 228990, 'Europe/London', 57.1497, -2.0943),
    city('Belfast', 'UK', 343542, 'Europe/London', 54.5973, -5.9301),
    
    // Additional French cities
    city('Bordeaux', 'France', 257068, 'Europe/Paris', 44.8378, -0.5792),
    city('Lille', 'France', 232741, 'Europe/Paris', 50.6292, 3.0573),
    city('Rennes', 'France', 216268, 'Europe/Paris', 48.1173, -1.6778),
    city('Reims', 'France', 182211, 'Europe/Paris', 49.2583, 4.0317),
    city('Saint-Étienne', 'France', 171924, 'Europe/Paris', 45.4397, 4.3872),
    city('Toulon', 'France', 171953, 'Europe/Paris', 43.1242, 5.9280),
    
    // Additional German cities
    city('Stuttgart', 'Germany', 634830, 'Europe/Berlin', 48.7758, 9.1829),
    city('Düsseldorf', 'Germany', 619294, 'Europe/Berlin', 51.2277, 6.7735),
    city('Leipzig', 'Germany', 587857, 'Europe/Berlin', 51.3397, 12.3731),
    city('Dortmund', 'Germany', 588250, 'Europe/Berlin', 51.5136, 7.4653),
    city('Essen', 'Germany', 583109, 'Europe/Berlin', 51.4556, 7.0116),
    city('Bremen', 'Germany', 567559, 'Europe/Berlin', 53.0793, 8.8017),
    city('Dresden', 'Germany', 554649, 'Europe/Berlin', 51.0504, 13.7373),
    
    // Additional Spanish cities
    city('Bilbao', 'Spain', 345821, 'Europe/Madrid', 43.2627, -2.9253),
    city('Las Palmas', 'Spain', 379925, 'Europe/Madrid', 28.1235, -15.4366),
    city('Murcia', 'Spain', 447182, 'Europe/Madrid', 37.9922, -1.1307),
    city('Palma', 'Spain', 409661, 'Europe/Madrid', 39.5696, 2.6502),
    city('Alicante', 'Spain', 334887, 'Europe/Madrid', 38.3453, -0.4831),
    
    // Additional Italian cities
    city('Genoa', 'Italy', 583601, 'Europe/Rome', 44.4056, 8.9463),
    city('Verona', 'Italy', 257275, 'Europe/Rome', 45.4384, 10.9916),
    city('Messina', 'Italy', 232555, 'Europe/Rome', 38.1938, 15.5540),
    city('Padua', 'Italy', 214125, 'Europe/Rome', 45.4064, 11.8768),
    city('Trieste', 'Italy', 204420, 'Europe/Rome', 45.6495, 13.7768),
    
    // Additional Polish cities
    city('Gdańsk', 'Poland', 470907, 'Europe/Warsaw', 54.3520, 18.6466),
    city('Szczecin', 'Poland', 402465, 'Europe/Warsaw', 53.4285, 14.5528),
    city('Bydgoszcz', 'Poland', 350178, 'Europe/Warsaw', 53.1235, 18.0084),
    city('Lublin', 'Poland', 339682, 'Europe/Warsaw', 51.2465, 22.5684),
    city('Białystok', 'Poland', 297554, 'Europe/Warsaw', 53.1325, 23.1688),
    
    // Additional cities in Netherlands
    city('Eindhoven', 'Netherlands', 234456, 'Europe/Amsterdam', 51.4416, 5.4697),
    city('Tilburg', 'Netherlands', 217595, 'Europe/Amsterdam', 51.5719, 5.0672),
    city('Groningen', 'Netherlands', 233218, 'Europe/Amsterdam', 53.2194, 6.5665),
    city('Almere', 'Netherlands', 211893, 'Europe/Amsterdam', 52.3508, 5.2647),
    
    // Additional cities in Belgium
    city('Antwerp', 'Belgium', 520504, 'Europe/Brussels', 51.2194, 4.4025),
    city('Ghent', 'Belgium', 262219, 'Europe/Brussels', 51.0543, 3.7174),
    city('Charleroi', 'Belgium', 201816, 'Europe/Brussels', 50.4108, 4.4446),
    city('Liège', 'Belgium', 197885, 'Europe/Brussels', 50.6326, 5.5797),
    
    // Additional cities in Portugal
    city('Vila Nova de Gaia', 'Portugal', 302295, 'Europe/Lisbon', 41.1333, -8.6167),
    city('Amadora', 'Portugal', 175136, 'Europe/Lisbon', 38.7500, -9.2333),
    city('Setúbal', 'Portugal', 121185, 'Europe/Lisbon', 38.5243, -8.8926),
    
    // Additional cities in Greece
    city('Athens', 'Greece', 664046, 'Europe/Athens', 37.9838, 23.7275),
    city('Thessaloniki', 'Greece', 325182, 'Europe/Athens', 40.6401, 22.9444),
    city('Patras', 'Greece', 167446, 'Europe/Athens', 38.2466, 21.7346),
    
    // Additional cities in Romania
    city('Bucharest', 'Romania', 2106144, 'Europe/Bucharest', 44.4268, 26.1025),
    city('Cluj-Napoca', 'Romania', 324576, 'Europe/Bucharest', 46.7712, 23.6236),
    city('Timișoara', 'Romania', 319279, 'Europe/Bucharest', 45.7489, 21.2087),
    
    // Additional cities in Hungary
    city('Budapest', 'Hungary', 1752286, 'Europe/Budapest', 47.4979, 19.0402),
    city('Debrecen', 'Hungary', 203493, 'Europe/Budapest', 47.5316, 21.6273),
    city('Szeged', 'Hungary', 162593, 'Europe/Budapest', 46.2530, 20.1414),
    
    // Additional cities in Czech Republic
    city('Prague', 'Czech Republic', 1324277, 'Europe/Prague', 50.0755, 14.4378),
    city('Brno', 'Czech Republic', 379466, 'Europe/Prague', 49.1951, 16.6068),
    city('Ostrava', 'Czech Republic', 289629, 'Europe/Prague', 49.8209, 18.2625),
    
    // Additional cities in Bulgaria
    city('Sofia', 'Bulgaria', 1307376, 'Europe/Sofia', 42.6977, 23.3219),
    city('Plovdiv', 'Bulgaria', 346893, 'Europe/Sofia', 42.1354, 24.7453),
    city('Varna', 'Bulgaria', 334870, 'Europe/Sofia', 43.2141, 27.9147),
    // UK
    { name: 'Birmingham', country: 'UK', population: 2607437, timezone: 'Europe/London', latitude: 52.4862, longitude: -1.8904 },
    { name: 'Leeds', country: 'UK', population: 789194, timezone: 'Europe/London', latitude: 53.8008, longitude: -1.5491 },
    { name: 'Liverpool', country: 'UK', population: 864122, timezone: 'Europe/London', latitude: 53.4084, longitude: -2.9916 },
    { name: 'Edinburgh', country: 'UK', population: 488050, timezone: 'Europe/London', latitude: 55.9533, longitude: -3.1883 },
    { name: 'Bristol', country: 'UK', population: 463405, timezone: 'Europe/London', latitude: 51.4545, longitude: -2.5879 },
    
    // France
    { name: 'Marseille', country: 'France', population: 850726, timezone: 'Europe/Paris', latitude: 43.2965, longitude: 5.3698 },
    { name: 'Toulouse', country: 'France', population: 471941, timezone: 'Europe/Paris', latitude: 43.6047, longitude: 1.4442 },
    { name: 'Nice', country: 'France', population: 342669, timezone: 'Europe/Paris', latitude: 43.7102, longitude: 7.2620 },
    { name: 'Nantes', country: 'France', population: 309346, timezone: 'Europe/Paris', latitude: 47.2184, longitude: -1.5536 },
    
    // Germany
    { name: 'Hamburg', country: 'Germany', population: 1841179, timezone: 'Europe/Berlin', latitude: 53.5511, longitude: 9.9937 },
    { name: 'Munich', country: 'Germany', population: 1471508, timezone: 'Europe/Berlin', latitude: 48.1351, longitude: 11.5820 },
    { name: 'Cologne', country: 'Germany', population: 1085664, timezone: 'Europe/Berlin', latitude: 50.9375, longitude: 6.9603 },
    { name: 'Frankfurt', country: 'Germany', population: 753056, timezone: 'Europe/Berlin', latitude: 50.1109, longitude: 8.6821 },
    
    // Spain
    { name: 'Barcelona', country: 'Spain', population: 1620343, timezone: 'Europe/Madrid', latitude: 41.3851, longitude: 2.1734 },
    { name: 'Seville', country: 'Spain', population: 688711, timezone: 'Europe/Madrid', latitude: 37.3891, longitude: -5.9845 },
    { name: 'Zaragoza', country: 'Spain', population: 674997, timezone: 'Europe/Madrid', latitude: 41.6488, longitude: -0.8891 },
    { name: 'Malaga', country: 'Spain', population: 574654, timezone: 'Europe/Madrid', latitude: 36.7213, longitude: -4.4217 },
    
    // Italy
    { name: 'Milan', country: 'Italy', population: 1396059, timezone: 'Europe/Rome', latitude: 45.4642, longitude: 9.1900 },
    { name: 'Turin', country: 'Italy', population: 886837, timezone: 'Europe/Rome', latitude: 45.0703, longitude: 7.6869 },
    { name: 'Bologna', country: 'Italy', population: 388367, timezone: 'Europe/Rome', latitude: 44.4949, longitude: 11.3426 },
    { name: 'Florence', country: 'Italy', population: 382258, timezone: 'Europe/Rome', latitude: 43.7696, longitude: 11.2558 },
    
    // Netherlands
    { name: 'Rotterdam', country: 'Netherlands', population: 651446, timezone: 'Europe/Amsterdam', latitude: 51.9244, longitude: 4.4777 },
    { name: 'The Hague', country: 'Netherlands', population: 544766, timezone: 'Europe/Amsterdam', latitude: 52.0705, longitude: 4.3007 },
    { name: 'Utrecht', country: 'Netherlands', population: 357597, timezone: 'Europe/Amsterdam', latitude: 52.0907, longitude: 5.1214 },
    
    // Poland
    { name: 'Lodz', country: 'Poland', population: 685285, timezone: 'Europe/Warsaw', latitude: 51.7592, longitude: 19.4559 },
    { name: 'Wroclaw', country: 'Poland', population: 639258, timezone: 'Europe/Warsaw', latitude: 51.1079, longitude: 17.0385 },
    { name: 'Poznan', country: 'Poland', population: 536438, timezone: 'Europe/Warsaw', latitude: 52.4064, longitude: 16.9252 },
    
    // Sweden
    { name: 'Gothenburg', country: 'Sweden', population: 579281, timezone: 'Europe/Stockholm', latitude: 57.7089, longitude: 11.9746 },
    { name: 'Malmo', country: 'Sweden', population: 344166, timezone: 'Europe/Stockholm', latitude: 55.6050, longitude: 13.0038 },
    
    // Portugal
    { name: 'Lisbon', country: 'Portugal', population: 517802, timezone: 'Europe/Lisbon', latitude: 38.7223, longitude: -9.1393 },
    { name: 'Braga', country: 'Portugal', population: 136885, timezone: 'Europe/Lisbon', latitude: 41.5454, longitude: -8.4265 }
  ];
}
