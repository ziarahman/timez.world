export function generateAfricanCities() {
  // Helper function to generate city objects
  const city = (name, country, population, timezone, latitude, longitude) => ({
    name, country, population, timezone, latitude, longitude
  });

  return [
    // Additional cities in Egypt
    city('Alexandria', 'Egypt', 5200000, 'Africa/Cairo', 31.2001, 29.9187),
    city('Giza', 'Egypt', 3628062, 'Africa/Cairo', 30.0131, 31.2089),
    city('Shubra El Kheima', 'Egypt', 1099354, 'Africa/Cairo', 30.1286, 31.2422),
    city('Port Said', 'Egypt', 749371, 'Africa/Cairo', 31.2567, 32.2989),
    city('Suez', 'Egypt', 728180, 'Africa/Cairo', 29.9668, 32.5498),
    
    // Additional cities in Nigeria
    city('Kano', 'Nigeria', 3848885, 'Africa/Lagos', 12.0000, 8.5167),
    city('Ibadan', 'Nigeria', 3565108, 'Africa/Lagos', 7.3964, 3.9167),
    city('Abuja', 'Nigeria', 3464123, 'Africa/Lagos', 9.0765, 7.3986),
    city('Port Harcourt', 'Nigeria', 1865000, 'Africa/Lagos', 4.8156, 7.0498),
    city('Benin City', 'Nigeria', 1496000, 'Africa/Lagos', 6.3176, 5.6145),
    city('Kaduna', 'Nigeria', 1582102, 'Africa/Lagos', 10.5167, 7.4333),
    
    // Additional cities in South Africa
    city('Cape Town', 'South Africa', 4618000, 'Africa/Johannesburg', -33.9249, 18.4241),
    city('Durban', 'South Africa', 3442361, 'Africa/Johannesburg', -29.8587, 31.0218),
    city('Port Elizabeth', 'South Africa', 967677, 'Africa/Johannesburg', -33.9608, 25.6022),
    city('Pretoria', 'South Africa', 741651, 'Africa/Johannesburg', -25.7479, 28.2293),
    city('Bloemfontein', 'South Africa', 556000, 'Africa/Johannesburg', -29.0852, 26.1596),
    
    // Additional cities in Morocco
    city('Casablanca', 'Morocco', 3359818, 'Africa/Casablanca', 33.5731, -7.5898),
    city('Rabat', 'Morocco', 1655753, 'Africa/Casablanca', 34.0209, -6.8416),
    city('Fez', 'Morocco', 1112072, 'Africa/Casablanca', 34.0333, -5.0000),
    city('Marrakesh', 'Morocco', 928850, 'Africa/Casablanca', 31.6295, -7.9811),
    city('Tangier', 'Morocco', 947952, 'Africa/Casablanca', 35.7595, -5.8340),
    
    // Additional cities in Algeria
    city('Algiers', 'Algeria', 3415811, 'Africa/Algiers', 36.7538, 3.0588),
    city('Oran', 'Algeria', 803329, 'Africa/Algiers', 35.6969, -0.6331),
    city('Constantine', 'Algeria', 450097, 'Africa/Algiers', 36.3650, 6.6147),
    city('Annaba', 'Algeria', 342703, 'Africa/Algiers', 36.9000, 7.7667),
    
    // Additional cities in Tunisia
    city('Tunis', 'Tunisia', 1056247, 'Africa/Tunis', 36.8065, 10.1815),
    city('Sfax', 'Tunisia', 330440, 'Africa/Tunis', 34.7400, 10.7600),
    city('Sousse', 'Tunisia', 271428, 'Africa/Tunis', 35.8333, 10.6333),
    
    // Additional cities in Kenya
    city('Nairobi', 'Kenya', 4397073, 'Africa/Nairobi', -1.2921, 36.8219),
    city('Mombasa', 'Kenya', 1200000, 'Africa/Nairobi', -4.0435, 39.6682),
    city('Nakuru', 'Kenya', 570674, 'Africa/Nairobi', -0.3031, 36.0800),
    
    // Additional cities in Tanzania
    city('Dar es Salaam', 'Tanzania', 6368000, 'Africa/Dar_es_Salaam', -6.7924, 39.2083),
    city('Mwanza', 'Tanzania', 1120000, 'Africa/Dar_es_Salaam', -2.5167, 32.9000),
    city('Arusha', 'Tanzania', 416442, 'Africa/Dar_es_Salaam', -3.3667, 36.6833),
    
    // Additional cities in Ethiopia
    city('Addis Ababa', 'Ethiopia', 3352000, 'Africa/Addis_Ababa', 9.0320, 38.7469),
    city('Dire Dawa', 'Ethiopia', 440000, 'Africa/Addis_Ababa', 9.5930, 41.8661),
    city('Mek\'ele', 'Ethiopia', 323700, 'Africa/Addis_Ababa', 13.4967, 39.4767),
    
    // Additional cities in Uganda
    city('Kampala', 'Uganda', 1507080, 'Africa/Kampala', 0.3476, 32.5825),
    city('Gulu', 'Uganda', 146858, 'Africa/Kampala', 2.7747, 32.2990),
    
    // Additional cities in Ghana
    city('Accra', 'Ghana', 2291352, 'Africa/Accra', 5.5560, -0.1969),
    city('Kumasi', 'Ghana', 2069350, 'Africa/Accra', 6.6885, -1.6244),
    city('Tamale', 'Ghana', 360579, 'Africa/Accra', 9.4075, -0.8533),
    
    // Additional cities in Senegal
    city('Dakar', 'Senegal', 3137196, 'Africa/Dakar', 14.7167, -17.4677),
    city('Touba', 'Senegal', 529176, 'Africa/Dakar', 14.8500, -15.8833),
    
    // Additional cities in Angola
    city('Luanda', 'Angola', 2487000, 'Africa/Luanda', -8.8383, 13.2344),
    city('Huambo', 'Angola', 665574, 'Africa/Luanda', -12.7761, 15.7392),
    
    // Additional cities in Mozambique
    city('Maputo', 'Mozambique', 1101170, 'Africa/Maputo', -25.9692, 32.5732),
    city('Matola', 'Mozambique', 675422, 'Africa/Maputo', -25.9622, 32.4589),
    
    // Additional cities in Zimbabwe
    city('Harare', 'Zimbabwe', 1485231, 'Africa/Harare', -17.8277, 31.0534),
    city('Bulawayo', 'Zimbabwe', 653337, 'Africa/Harare', -20.1325, 28.6262),
    // Egypt
    { name: 'Alexandria', country: 'Egypt', population: 5200000, timezone: 'Africa/Cairo', latitude: 31.2001, longitude: 29.9187 },
    { name: 'Giza', country: 'Egypt', population: 3628062, timezone: 'Africa/Cairo', latitude: 30.0131, longitude: 31.2089 },
    { name: 'Shubra El Kheima', country: 'Egypt', population: 1099354, timezone: 'Africa/Cairo', latitude: 30.1286, longitude: 31.2422 },
    
    // Nigeria
    { name: 'Kano', country: 'Nigeria', population: 3848885, timezone: 'Africa/Lagos', latitude: 12.0022, longitude: 8.5920 },
    { name: 'Ibadan', country: 'Nigeria', population: 3565108, timezone: 'Africa/Lagos', latitude: 7.3775, longitude: 3.9470 },
    { name: 'Abuja', country: 'Nigeria', population: 3464123, timezone: 'Africa/Lagos', latitude: 9.0765, longitude: 7.3986 },
    { name: 'Port Harcourt', country: 'Nigeria', population: 1865000, timezone: 'Africa/Lagos', latitude: 4.8156, longitude: 7.0498 },
    
    // South Africa
    { name: 'Pretoria', country: 'South Africa', population: 2921488, timezone: 'Africa/Johannesburg', latitude: -25.7479, longitude: 28.2293 },
    { name: 'Port Elizabeth', country: 'South Africa', population: 967677, timezone: 'Africa/Johannesburg', latitude: -33.9608, longitude: 25.6022 },
    { name: 'Bloemfontein', country: 'South Africa', population: 556000, timezone: 'Africa/Johannesburg', latitude: -29.0852, longitude: 26.1596 },
    
    // Morocco
    { name: 'Rabat', country: 'Morocco', population: 577827, timezone: 'Africa/Casablanca', latitude: 34.0209, longitude: -6.8416 },
    { name: 'Fez', country: 'Morocco', population: 1112072, timezone: 'Africa/Casablanca', latitude: 34.0333, longitude: -5.0000 },
    { name: 'Tangier', country: 'Morocco', population: 947952, timezone: 'Africa/Casablanca', latitude: 35.7595, longitude: -5.8340 },
    
    // Algeria
    { name: 'Algiers', country: 'Algeria', population: 3415811, timezone: 'Africa/Algiers', latitude: 36.7538, longitude: 3.0588 },
    { name: 'Oran', country: 'Algeria', population: 803329, timezone: 'Africa/Algiers', latitude: 35.6969, longitude: -0.6331 },
    { name: 'Constantine', country: 'Algeria', population: 450097, timezone: 'Africa/Algiers', latitude: 36.3650, longitude: 6.6147 },
    
    // Tunisia
    { name: 'Tunis', country: 'Tunisia', population: 693210, timezone: 'Africa/Tunis', latitude: 36.8065, longitude: 10.1815 },
    { name: 'Sfax', country: 'Tunisia', population: 330440, timezone: 'Africa/Tunis', latitude: 34.7400, longitude: 10.7600 },
    
    // Kenya
    { name: 'Mombasa', country: 'Kenya', population: 1208333, timezone: 'Africa/Nairobi', latitude: -4.0435, longitude: 39.6682 },
    { name: 'Nakuru', country: 'Kenya', population: 570674, timezone: 'Africa/Nairobi', latitude: -0.3031, longitude: 36.0800 },
    
    // Tanzania
    { name: 'Dar es Salaam', country: 'Tanzania', population: 6701650, timezone: 'Africa/Dar_es_Salaam', latitude: -6.7924, longitude: 39.2083 },
    { name: 'Mwanza', country: 'Tanzania', population: 1120000, timezone: 'Africa/Dar_es_Salaam', latitude: -2.5167, longitude: 32.9000 },
    
    // Uganda
    { name: 'Kampala', country: 'Uganda', population: 1507080, timezone: 'Africa/Kampala', latitude: 0.3476, longitude: 32.5825 },
    { name: 'Gulu', country: 'Uganda', population: 146858, timezone: 'Africa/Kampala', latitude: 2.7747, longitude: 32.2990 },
    
    // Ghana
    { name: 'Accra', country: 'Ghana', population: 2291352, timezone: 'Africa/Accra', latitude: 5.6037, longitude: -0.1870 },
    { name: 'Kumasi', country: 'Ghana', population: 2069350, timezone: 'Africa/Accra', latitude: 6.6885, longitude: -1.6244 },
    
    // Ethiopia
    { name: 'Dire Dawa', country: 'Ethiopia', population: 440000, timezone: 'Africa/Addis_Ababa', latitude: 9.5933, longitude: 41.8661 },
    { name: 'Mek\'ele', country: 'Ethiopia', population: 323700, timezone: 'Africa/Addis_Ababa', latitude: 13.4967, longitude: 39.4767 },
    
    // Sudan
    { name: 'Khartoum', country: 'Sudan', population: 5274321, timezone: 'Africa/Khartoum', latitude: 15.5007, longitude: 32.5599 },
    { name: 'Omdurman', country: 'Sudan', population: 2395159, timezone: 'Africa/Khartoum', latitude: 15.6167, longitude: 32.4800 }
  ];
}
