import { useState, useEffect } from 'react';
import { Timezone } from '../types';
import { City, cityService } from '../services/CityService';
import { CityApiService } from '../services/CityApiService';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemButton, 
  CircularProgress, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  ToggleButton,
  Box
} from '@mui/material';
import { Search as SearchIcon, Satellite as SatelliteIcon } from '@mui/icons-material';
import { getAvailableTimezones } from '../data/timezones';

interface CitySearchDialogProps {
  open: boolean;
  onClose: () => void;
  onCitySelect: (city: Timezone) => void;
}

export default function CitySearchDialog({ open, onClose, onCitySelect }: CitySearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<City[]>([]);
  const [staticCities] = useState(() => new Set(
    getAvailableTimezones().map(city => `${city.city}|${city.country}`)
  ));
  const [liveLookup, setLiveLookup] = useState(false);
  const [apiResults, setApiResults] = useState<City[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [debounceTimeout, setDebounceTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const regions = [
    { id: 'all', name: 'All Regions' },
    { id: 'asia', name: 'Asia' },
    { id: 'europe', name: 'Europe' },
    { id: 'americas', name: 'Americas' },
    { id: 'africa', name: 'Africa' },
    { id: 'oceania', name: 'Oceania' },
  ];

  // Load cities when dialog opens or region changes
  useEffect(() => {
    if (open) {
      setLoading(true);
      cityService.searchCities('', selectedRegion)
        .then(cities => {
          if (selectedRegion !== 'all') {
            setResults(cities);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [open, selectedRegion]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2 && selectedRegion === 'all') {
      setResults([]);
      setApiResults([]);
      setApiError(null);
      return;
    }

    setLoading(true);
    try {
      // Search local database
      const searchResults = await cityService.searchCities(query, selectedRegion);
      // Filter out cities that are already in the static list
      const filteredResults = searchResults.filter(city => 
        !staticCities.has(`${city.name}|${city.country}`)
      );
      setResults(filteredResults);

      // If live lookup is enabled, search API
      if (liveLookup && query.length >= 3) {
        try {
          const apiService = CityApiService.getInstance();
          const apiData = await apiService.searchCities(query);
          
          // Add timezone information to API results
          const apiResultsWithTimezones = apiData.map(city => ({
            ...city,
            // Format timezone ID properly using the formatTimezone function
            timezone: formatTimezone(`${city.country}/${city.city}`)
          }));

          setApiResults(apiResultsWithTimezones);
          setApiError(null);
        } catch (error) {
          console.error('API search failed:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            error: error
          });
          setApiError(`API search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Search failed:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error: error
      });
      setResults([]);
      setApiResults([]);
      setApiError(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLiveLookupChange = () => {
    setLiveLookup(!liveLookup);
    // Clear API results when toggling live lookup
    setApiResults([]);
    setApiError(null);
  };

  const handleSelect = (city: City) => {
    const timezoneCity: Timezone = {
      id: formatTimezone(city.timezone), // Use the formatted timezone
      name: `${city.name}, ${city.country}`,
      city: city.name,
      country: city.country,
      population: city.population,
      offset: 0 // This will be calculated by the parent component
    };

    // Add the city to the local database if it's not already there
    const cityKey = `${city.name}|${city.country}`;
    if (!staticCities.has(cityKey)) {
      // Format the timezone ID properly
      const formattedTimezone = formatTimezone(city.timezone);
      
      cityService.addCity({
        name: city.name,
        city: city.name,
        country: city.country,
        timezone: formattedTimezone,
        latitude: city.latitude,
        longitude: city.longitude,
        population: city.population,
        offset: 0
      });
    }

    onCitySelect(timezoneCity);
    onClose();
  };

  // Helper function to format timezone IDs to match IANA format
  function formatTimezone(timezone: string): string {
    // First check if it's already a valid IANA timezone
    const validIANA = timezone.match(/^[A-Za-z]+\/[A-Za-z0-9_]+$/);
    if (validIANA) {
      return timezone;
    }

    // Handle special cases
    const specialCases = {
      'sylhet': 'Asia/Dhaka',
      'asia_dhaka': 'Asia/Dhaka',
      'asia_singapore': 'Asia/Singapore',
      'asia_shanghai': 'Asia/Shanghai',
      'asia_tokyo': 'Asia/Tokyo',
      'asia_seoul': 'Asia/Seoul',
      'asia_beijing': 'Asia/Shanghai', // Beijing uses Shanghai timezone
      'asia_hong_kong': 'Asia/Hong_Kong',
      'asia_taipei': 'Asia/Taipei',
      'asia_manila': 'Asia/Manila',
      'asia_jakarta': 'Asia/Jakarta',
      'asia_kuala_lumpur': 'Asia/Kuala_Lumpur',
      'asia_bangkok': 'Asia/Bangkok',
      'asia_ho_chi_minh': 'Asia/Ho_Chi_Minh',
      'asia_hanoi': 'Asia/Hanoi',
      'asia_colombo': 'Asia/Colombo',
      'asia_karachi': 'Asia/Karachi',
      'asia_istanbul': 'Europe/Istanbul',
      'asia_moscow': 'Europe/Moscow',
      'asia_berlin': 'Europe/Berlin',
      'asia_london': 'Europe/London',
      'asia_paris': 'Europe/Paris',
      'asia_rome': 'Europe/Rome',
      'asia_madrid': 'Europe/Madrid',
      'asia_athens': 'Europe/Athens',
      'asia_cairo': 'Africa/Cairo',
      'asia_johannesburg': 'Africa/Johannesburg',
      'asia_lagos': 'Africa/Lagos'
    };

    // Check if it's a special case
    const normalized = timezone.toLowerCase()
      .replace(/[^a-z0-9_]+/g, '_')
      .replace(/_+/g, '_') // Replace multiple underscores with single underscore
      .replace(/_$/, ''); // Remove trailing underscore

    const cityPart = normalized.split('_').pop() || normalized;
    const specialCase = specialCases[cityPart];
    if (specialCase) {
      return specialCase;
    }

    // Try to match against known continent/city format
    const continentMap = {
      'asia': 'Asia',
      'europe': 'Europe',
      'americas': 'America',
      'africa': 'Africa',
      'oceania': 'Australia'
    };

    // Try to match the city name against known cities
    const knownCities = {
      'dhaka': 'Dhaka',
      'sylhet': 'Dhaka', // Sylhet is in the same timezone as Dhaka
      // Add more known cities as needed
    };

    // Split the timezone into parts
    const parts = normalized.split('_');
    const continent = parts[0];
    const city = parts[1] || parts[0];

    // Get the proper continent name
    const properContinent = continentMap[continent] || continent.charAt(0).toUpperCase() + continent.slice(1);
    // Get the proper city name
    const properCity = knownCities[city] || city.charAt(0).toUpperCase() + city.slice(1);

    // Return in IANA format
    return `${properContinent}/${properCity}`;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          Search & Add Additional Cities
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {cityService.getTotalCities().toLocaleString()} cities available in the database
          </Typography>
        </Typography>
      </DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <InputLabel>Region</InputLabel>
          <Select
            value={selectedRegion}
            label="Region"
            onChange={(e) => {
              setSelectedRegion(e.target.value);
              handleSearch(searchQuery);
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            {regions.map((region) => (
              <MenuItem key={region.id} value={region.id}>
                {region.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <ToggleButton
            value={liveLookup}
            onClick={handleLiveLookupChange}
            sx={{
              mr: 1,
              bgcolor: liveLookup ? 'primary.main' : 'transparent',
              color: liveLookup ? 'white' : 'inherit',
              '&:hover': {
                bgcolor: liveLookup ? 'primary.dark' : 'action.hover'
              }
            }}
          >
            <SatelliteIcon />
          </ToggleButton>
          <Typography variant="body2" color="text.secondary">
            Live Lookup
          </Typography>
        </Box>

        <TextField
          autoFocus
          margin="dense"
          label="Search by city or country name"
          fullWidth
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            // Debounce API calls
            if (debounceTimeout) {
              clearTimeout(debounceTimeout);
            }
            setDebounceTimeout(
              setTimeout(() => handleSearch(e.target.value), 250)
            );
          }}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1 }} />
            )
          }}
        />

        {apiError && (
          <Typography color="error" sx={{ mt: 2 }}>
            {apiError}
            <Typography variant="caption" color="error" sx={{ mt: 1 }}>
              Note: Live Lookup is currently disabled. Please try searching directly in the database.
            </Typography>
          </Typography>
        )}

        {loading ? (
          <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
        ) : (
          <List sx={{ mt: 2 }}>
            {results.length > 0 && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  Local Database Results
                </Typography>
                {results.map((city) => (
                  <ListItem disablePadding key={`${city.name}-${city.country}-${city.timezone}`}>
                    <ListItemButton onClick={() => handleSelect(city)}>
                      <ListItemText
                        primary={`${city.name}, ${city.country}`}
                        secondary={`Population: ${city.population.toLocaleString()}`}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </>
            )}

            {liveLookup && apiResults.length > 0 && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  API Results
                </Typography>
                {apiResults.map((city) => (
                  <ListItem disablePadding key={`${city.name}-${city.country}-${city.timezone}`}>
                    <ListItemButton onClick={() => handleSelect(city)}>
                      <ListItemText
                        primary={`${city.name || city.city}, ${city.country}`}
                        secondary={`Timezone: ${city.timezone}`}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </>
            )}

            {(results.length === 0 && apiResults.length === 0 && searchQuery.length >= 2) && (
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                No cities found matching your search
              </Typography>
            )}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
