import axios from 'axios';

async function testGeodb() {
  try {
    const response = await axios.get('https://wft-geo-db.p.rapidapi.com/v1/geo/cities', {
      headers: {
        'X-RapidAPI-Key': process.env.REACT_APP_GEODB_API_KEY,
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
      },
      params: {
        namePrefix: 'London',
        limit: 1
      }
    });
    console.log('GeoDB Test Success:', response.data);
    return true;
  } catch (error) {
    console.error('GeoDB Test Failed:', error.response?.data || error);
    return false;
  }
}

async function testOpenCage() {
  try {
    const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
      params: {
        q: 'London, UK',
        key: process.env.REACT_APP_OPENCAGE_API_KEY,
        limit: 1
      }
    });
    console.log('OpenCage Test Success:', response.data);
    return true;
  } catch (error) {
    console.error('OpenCage Test Failed:', error.response?.data || error);
    return false;
  }
}

async function testOpenWeather() {
  try {
    const response = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
      params: {
        q: 'London',
        limit: 1,
        appid: process.env.REACT_APP_OPENWEATHER_API_KEY
      }
    });
    console.log('OpenWeather Test Success:', response.data);
    return true;
  } catch (error) {
    console.error('OpenWeather Test Failed:', error.response?.data || error);
    return false;
  }
}

async function testTimezoneDb() {
  try {
    const response = await axios.get('https://api.timezonedb.com/v2.1/get-time-zone', {
      params: {
        key: process.env.REACT_APP_TIMEZONEDB_API_KEY,
        format: 'json',
        by: 'position',
        lat: 51.5074,
        lng: -0.1278
      }
    });
    console.log('TimezoneDB Test Success:', response.data);
    return true;
  } catch (error) {
    console.error('TimezoneDB Test Failed:', error.response?.data || error);
    return false;
  }
}

async function testAllApis() {
  console.log('Testing APIs...');
  
  const results = {
    geodb: await testGeodb(),
    opencage: await testOpenCage(),
    openweather: await testOpenWeather(),
    timezoneDb: await testTimezoneDb()
  };

  console.log('\nAPI Test Results:', results);
  return results;
}

// Run the tests
testAllApis();
