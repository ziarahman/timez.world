export function generateOceaniaCities() {
  // Helper function to generate city objects
  const city = (name, country, population, timezone, latitude, longitude) => ({
    name, country, population, timezone, latitude, longitude
  });

  return [
    // Additional Australian cities
    city('Gold Coast', 'Australia', 679127, 'Australia/Brisbane', -28.0167, 153.4000),
    city('Newcastle', 'Australia', 322278, 'Australia/Sydney', -32.9167, 151.7500),
    city('Canberra', 'Australia', 431380, 'Australia/Sydney', -35.2809, 149.1300),
    city('Wollongong', 'Australia', 302739, 'Australia/Sydney', -34.4331, 150.8831),
    city('Hobart', 'Australia', 248983, 'Australia/Hobart', -42.8821, 147.3272),
    city('Geelong', 'Australia', 196393, 'Australia/Melbourne', -38.1500, 144.3500),
    city('Townsville', 'Australia', 180820, 'Australia/Brisbane', -19.2564, 146.8183),
    city('Cairns', 'Australia', 152729, 'Australia/Brisbane', -16.9186, 145.7781),
    city('Darwin', 'Australia', 147255, 'Australia/Darwin', -12.4634, 130.8456),
    city('Toowoomba', 'Australia', 136861, 'Australia/Brisbane', -27.5667, 151.9500),
    
    // Additional New Zealand cities
    city('Hamilton', 'New Zealand', 176500, 'Pacific/Auckland', -37.7833, 175.2833),
    city('Tauranga', 'New Zealand', 155200, 'Pacific/Auckland', -37.6878, 176.1651),
    city('Lower Hutt', 'New Zealand', 111800, 'Pacific/Auckland', -41.2167, 174.9167),
    city('Dunedin', 'New Zealand', 130100, 'Pacific/Auckland', -45.8742, 170.5036),
    city('Palmerston North', 'New Zealand', 88700, 'Pacific/Auckland', -40.3556, 175.6167),
    city('Napier', 'New Zealand', 66300, 'Pacific/Auckland', -39.4833, 176.9167),
    city('Porirua', 'New Zealand', 59100, 'Pacific/Auckland', -41.1333, 174.8500),
    
    // Additional cities in Papua New Guinea
    city('Port Moresby', 'Papua New Guinea', 364125, 'Pacific/Port_Moresby', -9.4431, 147.1797),
    city('Lae', 'Papua New Guinea', 76255, 'Pacific/Port_Moresby', -6.7333, 146.9833),
    city('Mount Hagen', 'Papua New Guinea', 46250, 'Pacific/Port_Moresby', -5.8583, 144.2333),
    city('Madang', 'Papua New Guinea', 27420, 'Pacific/Port_Moresby', -5.2167, 145.7833),
    
    // Cities in Fiji
    city('Suva', 'Fiji', 93970, 'Pacific/Fiji', -18.1416, 178.4419),
    city('Lautoka', 'Fiji', 71573, 'Pacific/Fiji', -17.6167, 177.4500),
    city('Nadi', 'Fiji', 50000, 'Pacific/Fiji', -17.8000, 177.4167),
    
    // Cities in New Caledonia
    city('Nouméa', 'New Caledonia', 94285, 'Pacific/Noumea', -22.2758, 166.4580),
    city('Mont-Dore', 'New Caledonia', 27155, 'Pacific/Noumea', -22.2667, 166.5667),
    
    // Cities in French Polynesia
    city('Papeete', 'French Polynesia', 26357, 'Pacific/Tahiti', -17.5333, -149.5667),
    city('Faaa', 'French Polynesia', 29851, 'Pacific/Tahiti', -17.5500, -149.6000),
    
    // Cities in Samoa
    city('Apia', 'Samoa', 37708, 'Pacific/Apia', -13.8333, -171.7667),
    city('Vaitele', 'Samoa', 8500, 'Pacific/Apia', -13.8167, -171.8000),
    
    // Cities in Vanuatu
    city('Port Vila', 'Vanuatu', 51437, 'Pacific/Efate', -17.7333, 168.3167),
    city('Luganville', 'Vanuatu', 16312, 'Pacific/Efate', -15.5333, 167.1667),
    
    // Cities in Solomon Islands
    city('Honiara', 'Solomon Islands', 84520, 'Pacific/Guadalcanal', -9.4333, 159.9500),
    city('Auki', 'Solomon Islands', 7896, 'Pacific/Guadalcanal', -8.7667, 160.7000),
    
    // Cities in Tonga
    city('Nukuʻalofa', 'Tonga', 22400, 'Pacific/Tongatapu', -21.1333, -175.2000),
    
    // Cities in American Samoa
    city('Pago Pago', 'American Samoa', 3656, 'Pacific/Pago_Pago', -14.2781, -170.7025),
    // Australia
    { name: 'Adelaide', country: 'Australia', population: 1345777, timezone: 'Australia/Adelaide', latitude: -34.9285, longitude: 138.6007 },
    { name: 'Canberra', country: 'Australia', population: 431380, timezone: 'Australia/Sydney', latitude: -35.2809, longitude: 149.1300 },
    { name: 'Newcastle', country: 'Australia', population: 322278, timezone: 'Australia/Sydney', latitude: -32.9283, longitude: 151.7817 },
    { name: 'Wollongong', country: 'Australia', population: 302739, timezone: 'Australia/Sydney', latitude: -34.4331, longitude: 150.8831 },
    { name: 'Hobart', country: 'Australia', population: 248983, timezone: 'Australia/Hobart', latitude: -42.8821, longitude: 147.3272 },
    { name: 'Geelong', country: 'Australia', population: 196393, timezone: 'Australia/Melbourne', latitude: -38.1499, longitude: 144.3617 },
    { name: 'Townsville', country: 'Australia', population: 180820, timezone: 'Australia/Brisbane', latitude: -19.2590, longitude: 146.8169 },
    { name: 'Cairns', country: 'Australia', population: 152729, timezone: 'Australia/Brisbane', latitude: -16.9186, longitude: 145.7781 },
    { name: 'Darwin', country: 'Australia', population: 147255, timezone: 'Australia/Darwin', latitude: -12.4634, longitude: 130.8456 },
    
    // New Zealand
    { name: 'Christchurch', country: 'New Zealand', population: 377200, timezone: 'Pacific/Auckland', latitude: -43.5320, longitude: 172.6306 },
    { name: 'Hamilton', country: 'New Zealand', population: 176500, timezone: 'Pacific/Auckland', latitude: -37.7870, longitude: 175.2793 },
    { name: 'Tauranga', country: 'New Zealand', population: 151300, timezone: 'Pacific/Auckland', latitude: -37.6878, longitude: 176.1651 },
    { name: 'Dunedin', country: 'New Zealand', population: 130100, timezone: 'Pacific/Auckland', latitude: -45.8788, longitude: 170.5028 },
    { name: 'Palmerston North', country: 'New Zealand', population: 88700, timezone: 'Pacific/Auckland', latitude: -40.3564, longitude: 175.6147 },
    
    // Papua New Guinea
    { name: 'Port Moresby', country: 'Papua New Guinea', population: 364125, timezone: 'Pacific/Port_Moresby', latitude: -9.4438, longitude: 147.1803 },
    { name: 'Lae', country: 'Papua New Guinea', population: 76255, timezone: 'Pacific/Port_Moresby', latitude: -6.7330, longitude: 147.0000 },
    
    // Fiji
    { name: 'Suva', country: 'Fiji', population: 93970, timezone: 'Pacific/Fiji', latitude: -18.1416, longitude: 178.4419 },
    { name: 'Lautoka', country: 'Fiji', population: 71573, timezone: 'Pacific/Fiji', latitude: -17.6169, longitude: 177.4508 },
    
    // New Caledonia
    { name: 'Nouméa', country: 'New Caledonia', population: 94285, timezone: 'Pacific/Noumea', latitude: -22.2758, longitude: 166.4580 }
  ];
}
