export function generateAsianCities() {
  // Helper function to generate city objects
  const city = (name, country, population, timezone, latitude, longitude) => ({
    name, country, population, timezone, latitude, longitude
  });

  return [
    // Additional Chinese cities
    city('Tianjin', 'China', 13589078, 'Asia/Shanghai', 39.3434, 117.3616),
    city('Dongguan', 'China', 8220207, 'Asia/Shanghai', 23.0489, 113.7447),
    city('Shenyang', 'China', 8106171, 'Asia/Shanghai', 41.8057, 123.4315),
    city('Foshan', 'China', 7197394, 'Asia/Shanghai', 23.0292, 113.1056),
    city('Harbin', 'China', 5878939, 'Asia/Shanghai', 45.8038, 126.5340),
    city('Qingdao', 'China', 5819866, 'Asia/Shanghai', 36.0671, 120.3826),
    city('Dalian', 'China', 5757283, 'Asia/Shanghai', 38.9140, 121.6147),
    city('Xiamen', 'China', 4290000, 'Asia/Shanghai', 24.4798, 118.0819),
    city('Fuzhou', 'China', 4180000, 'Asia/Shanghai', 26.0745, 119.2965),
    city('Kunming', 'China', 3855346, 'Asia/Shanghai', 25.0389, 102.7183),
    city('Shantou', 'China', 3842304, 'Asia/Shanghai', 23.3540, 116.6817),
    city('Jinan', 'China', 3681865, 'Asia/Shanghai', 36.6512, 117.1201),
    city('Hefei', 'China', 3670000, 'Asia/Shanghai', 31.8206, 117.2272),
    city('Urumqi', 'China', 3550000, 'Asia/Shanghai', 43.8256, 87.6168),
    city('Shijiazhuang', 'China', 3375000, 'Asia/Shanghai', 38.0428, 114.5149),
    
    // Additional Japanese cities
    city('Yokohama', 'Japan', 3725000, 'Asia/Tokyo', 35.4437, 139.6380),
    city('Nagoya', 'Japan', 2296000, 'Asia/Tokyo', 35.1815, 136.9066),
    city('Kyoto', 'Japan', 1475000, 'Asia/Tokyo', 35.0116, 135.7681),
    city('Sendai', 'Japan', 1082000, 'Asia/Tokyo', 38.2682, 140.8694),
    city('Chiba', 'Japan', 979768, 'Asia/Tokyo', 35.6073, 140.1063),
    city('Niigata', 'Japan', 810157, 'Asia/Tokyo', 37.9161, 139.0364),
    city('Hamamatsu', 'Japan', 797980, 'Asia/Tokyo', 34.7104, 137.7273),
    
    // Additional South Korean cities
    city('Ulsan', 'South Korea', 1166033, 'Asia/Seoul', 35.5384, 129.3114),
    city('Changwon', 'South Korea', 1059241, 'Asia/Seoul', 35.2280, 128.6811),
    city('Suwon', 'South Korea', 1242724, 'Asia/Seoul', 37.2636, 127.0286),
    city('Goyang', 'South Korea', 990073, 'Asia/Seoul', 37.6564, 126.8350),
    
    // Additional cities in Southeast Asia
    city('Bekasi', 'Indonesia', 2510000, 'Asia/Jakarta', -6.2349, 106.9896),
    city('Tangerang', 'Indonesia', 2001925, 'Asia/Jakarta', -6.1783, 106.6319),
    city('Depok', 'Indonesia', 1869681, 'Asia/Jakarta', -6.4025, 106.7942),
    city('Semarang', 'Indonesia', 1555984, 'Asia/Jakarta', -6.9932, 110.4203),
    city('Palembang', 'Indonesia', 1548064, 'Asia/Jakarta', -2.9761, 104.7754),
    city('Makassar', 'Indonesia', 1423877, 'Asia/Jakarta', -5.1477, 119.4327),
    
    // Additional cities in Thailand
    city('Nakhon Ratchasima', 'Thailand', 2639000, 'Asia/Bangkok', 14.9798, 102.0978),
    city('Udon Thani', 'Thailand', 399000, 'Asia/Bangkok', 17.4137, 102.7872),
    city('Hat Yai', 'Thailand', 359813, 'Asia/Bangkok', 7.0086, 100.4747),
    
    // Additional cities in Vietnam
    city('Bien Hoa', 'Vietnam', 1104000, 'Asia/Ho_Chi_Minh', 10.9508, 106.8221),
    city('Hue', 'Vietnam', 455000, 'Asia/Ho_Chi_Minh', 16.4637, 107.5909),
    city('Nha Trang', 'Vietnam', 446000, 'Asia/Ho_Chi_Minh', 12.2388, 109.1967),
    
    // Additional cities in Malaysia
    city('Petaling Jaya', 'Malaysia', 613977, 'Asia/Kuala_Lumpur', 3.1067, 101.6056),
    city('Shah Alam', 'Malaysia', 541306, 'Asia/Kuala_Lumpur', 3.0733, 101.5185),
    city('Malacca City', 'Malaysia', 484885, 'Asia/Kuala_Lumpur', 2.1896, 102.2501),
    
    // Additional cities in Philippines
    city('Caloocan', 'Philippines', 1583978, 'Asia/Manila', 14.6500, 120.9667),
    city('Zamboanga', 'Philippines', 861799, 'Asia/Manila', 6.9167, 122.0833),
    city('Pasig', 'Philippines', 755300, 'Asia/Manila', 14.5750, 121.0833),
    city('Taguig', 'Philippines', 644473, 'Asia/Manila', 14.5167, 121.0500),
    
    // Additional cities in Pakistan
    city('Lahore', 'Pakistan', 11126285, 'Asia/Karachi', 31.5497, 74.3436),
    city('Faisalabad', 'Pakistan', 3203846, 'Asia/Karachi', 31.4504, 73.1350),
    city('Rawalpindi', 'Pakistan', 2098231, 'Asia/Karachi', 33.6007, 73.0679),
    city('Multan', 'Pakistan', 1871843, 'Asia/Karachi', 30.1575, 71.5249),
    city('Hyderabad', 'Pakistan', 1732693, 'Asia/Karachi', 25.3960, 68.3578),
    
    // Additional cities in Bangladesh
    city('Dhaka', 'Bangladesh', 8906039, 'Asia/Dhaka', 23.8103, 90.4125),
    city('Chittagong', 'Bangladesh', 2581643, 'Asia/Dhaka', 22.3569, 91.7832),
    city('Khulna', 'Bangladesh', 1342339, 'Asia/Dhaka', 22.8456, 89.5403),
    city('Rajshahi', 'Bangladesh', 700133, 'Asia/Dhaka', 24.3745, 88.6042),
    
    // Additional cities in Myanmar
    city('Yangon', 'Myanmar', 5214000, 'Asia/Yangon', 16.8661, 96.1951),
    city('Mandalay', 'Myanmar', 1225546, 'Asia/Yangon', 21.9588, 96.0891),
    city('Naypyidaw', 'Myanmar', 925000, 'Asia/Yangon', 19.7633, 96.0785),
    
    // Additional cities in Cambodia
    city('Phnom Penh', 'Cambodia', 1501725, 'Asia/Phnom_Penh', 11.5564, 104.9282),
    city('Siem Reap', 'Cambodia', 139458, 'Asia/Phnom_Penh', 13.3633, 103.8564),
    
    // Additional cities in Laos
    city('Vientiane', 'Laos', 820940, 'Asia/Vientiane', 17.9757, 102.6331),
    city('Pakse', 'Laos', 88332, 'Asia/Vientiane', 15.1208, 105.7837),
    // China
    { name: 'Suzhou', country: 'China', population: 5345961, timezone: 'Asia/Shanghai', latitude: 31.2990, longitude: 120.5853 },
    { name: 'Nanjing', country: 'China', population: 8270500, timezone: 'Asia/Shanghai', latitude: 32.0617, longitude: 118.7778 },
    { name: 'Xian', country: 'China', population: 8705600, timezone: 'Asia/Shanghai', latitude: 34.3416, longitude: 108.9398 },
    { name: 'Zhengzhou', country: 'China', population: 4253913, timezone: 'Asia/Shanghai', latitude: 34.7472, longitude: 113.6250 },
    { name: 'Changsha', country: 'China', population: 3930140, timezone: 'Asia/Shanghai', latitude: 28.2278, longitude: 112.9388 },
    
    // Japan
    { name: 'Kobe', country: 'Japan', population: 1528478, timezone: 'Asia/Tokyo', latitude: 34.6901, longitude: 135.1955 },
    { name: 'Kawasaki', country: 'Japan', population: 1475213, timezone: 'Asia/Tokyo', latitude: 35.5167, longitude: 139.7000 },
    { name: 'Saitama', country: 'Japan', population: 1264321, timezone: 'Asia/Tokyo', latitude: 35.8617, longitude: 139.6453 },
    { name: 'Hiroshima', country: 'Japan', population: 1196274, timezone: 'Asia/Tokyo', latitude: 34.3853, longitude: 132.4553 },
    
    // South Korea
    { name: 'Daegu', country: 'South Korea', population: 2438031, timezone: 'Asia/Seoul', latitude: 35.8714, longitude: 128.6014 },
    { name: 'Daejeon', country: 'South Korea', population: 1475221, timezone: 'Asia/Seoul', latitude: 36.3504, longitude: 127.3845 },
    { name: 'Gwangju', country: 'South Korea', population: 1475745, timezone: 'Asia/Seoul', latitude: 35.1595, longitude: 126.8526 },
    
    // Taiwan
    { name: 'Taichung', country: 'Taiwan', population: 2809004, timezone: 'Asia/Taipei', latitude: 24.1477, longitude: 120.6736 },
    { name: 'Tainan', country: 'Taiwan', population: 1885252, timezone: 'Asia/Taipei', latitude: 22.9999, longitude: 120.2269 },
    { name: 'Hsinchu', country: 'Taiwan', population: 449287, timezone: 'Asia/Taipei', latitude: 24.8036, longitude: 120.9686 },
    
    // Thailand
    { name: 'Nonthaburi', country: 'Thailand', population: 255793, timezone: 'Asia/Bangkok', latitude: 13.8622, longitude: 100.5134 },
    { name: 'Chiang Mai', country: 'Thailand', population: 131091, timezone: 'Asia/Bangkok', latitude: 18.7883, longitude: 98.9853 },
    { name: 'Pattaya', country: 'Thailand', population: 119532, timezone: 'Asia/Bangkok', latitude: 12.9236, longitude: 100.8825 },
    
    // Vietnam
    { name: 'Hai Phong', country: 'Vietnam', population: 2013092, timezone: 'Asia/Ho_Chi_Minh', latitude: 20.8449, longitude: 106.6881 },
    { name: 'Can Tho', country: 'Vietnam', population: 1235171, timezone: 'Asia/Ho_Chi_Minh', latitude: 10.0333, longitude: 105.7833 },
    { name: 'Da Nang', country: 'Vietnam', population: 1134310, timezone: 'Asia/Ho_Chi_Minh', latitude: 16.0544, longitude: 108.2022 },
    
    // Indonesia
    { name: 'Surabaya', country: 'Indonesia', population: 2874699, timezone: 'Asia/Jakarta', latitude: -7.2492, longitude: 112.7508 },
    { name: 'Bandung', country: 'Indonesia', population: 2575478, timezone: 'Asia/Jakarta', latitude: -6.9147, longitude: 107.6098 },
    { name: 'Medan', country: 'Indonesia', population: 2247425, timezone: 'Asia/Jakarta', latitude: 3.5952, longitude: 98.6722 },
    
    // Malaysia
    { name: 'Penang', country: 'Malaysia', population: 708127, timezone: 'Asia/Kuala_Lumpur', latitude: 5.4145, longitude: 100.3292 },
    { name: 'Johor Bahru', country: 'Malaysia', population: 875000, timezone: 'Asia/Kuala_Lumpur', latitude: 1.4927, longitude: 103.7414 },
    { name: 'Ipoh', country: 'Malaysia', population: 673318, timezone: 'Asia/Kuala_Lumpur', latitude: 4.5975, longitude: 101.0901 },
    
    // Philippines
    { name: 'Quezon City', country: 'Philippines', population: 2936116, timezone: 'Asia/Manila', latitude: 14.6760, longitude: 121.0437 },
    { name: 'Davao', country: 'Philippines', population: 1632991, timezone: 'Asia/Manila', latitude: 7.0707, longitude: 125.6087 },
    { name: 'Cebu', country: 'Philippines', population: 922611, timezone: 'Asia/Manila', latitude: 10.3157, longitude: 123.8854 }
  ];
}
