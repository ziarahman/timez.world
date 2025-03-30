import { useState, useEffect } from 'react';
import { Timezone } from '../types';
import { cityService } from '../services/CityService';
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
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  ToggleButton,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { getAvailableTimezones } from '../data/timezones';

interface City {
  id: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
  latitude: number;
  longitude: number;
  population: number;
  offset: number;
}

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
      console.log('CitySearchDialog: useEffect triggered, open=', open, 'region=', selectedRegion, 'query=', searchQuery);
      setLoading(true);
      
      // If search query is empty, load initial static cities
      if (searchQuery.trim() === '') {
        try {
          const staticCitiesMap = cityService.getStaticCities();
          console.log('CitySearchDialog: Fetched staticCitiesMap:', staticCitiesMap);
          let initialCities = Array.from(staticCitiesMap.values());

          // Filter by region if a specific region is selected
          if (selectedRegion !== 'all') {
            initialCities = initialCities.filter(city => 
              city.timezone.startsWith(selectedRegion)
            );
          }
          
          console.log('CitySearchDialog: Setting initialCities:', initialCities);
          setResults(initialCities);
          setApiResults([]); // Clear API results
          setApiError(null);
        } catch (error) {
          console.error('Failed to load initial cities:', error);
          setResults([]);
          setApiError('Failed to load initial cities.');
        } finally {
          setLoading(false);
        }
      } else {
        // If search query exists, perform search as before
        cityService.searchCities(searchQuery, selectedRegion)
          .then(cities => {
            setResults(cities); // Set results regardless of region when searching
          })
          .catch(error => {
            console.error('Search failed:', error);
            setResults([]);
            setApiError('Search failed.');
          })
          .finally(() => setLoading(false));
      }
    }
  }, [open, selectedRegion, searchQuery]);

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
            // Correct: Pass the actual timezone property if available from API,
            // otherwise, it might need fetching or defaulting
            timezone: city.timezone ? formatTimezone(city.timezone) : 'Etc/Unknown' // Assuming API provides timezone
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
    // Ensure the selected city conforms to the Timezone type
    const timezoneCity: Timezone = {
      // Use the city's actual ID if available, otherwise construct one
      id: city.id || `${city.city}/${city.country}`, // Fallback ID construction
      name: `${city.name}, ${city.country}`,
      city: city.city || city.name, // Use city.city if available, else city.name
      country: city.country,
      // Correct: Pass the actual timezone string to formatTimezone
      timezone: city.timezone ? formatTimezone(city.timezone) : 'Etc/Unknown', // Assuming city object has timezone
      latitude: city.latitude,
      longitude: city.longitude,
      population: city.population || 0, // Default population if missing
      offset: city.offset ?? 0, // Use nullish coalescing for offset
    };
    onCitySelect(timezoneCity);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Search & Add Additional Cities
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Region</InputLabel>
            <Select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value as string);
                handleSearch(searchQuery);
              }}
              label="Region"
            >
              {regions.map((region) => (
                <MenuItem key={region.id} value={region.id}>
                  {region.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <ToggleButton
            value="live"
            selected={liveLookup}
            onChange={handleLiveLookupChange}
            sx={{ textTransform: 'none' }}
          >
            <SearchIcon sx={{ mr: 1 }} />
            Live Lookup
          </ToggleButton>
        </Box>
        
        <TextField
          fullWidth
          label="Search for a city"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon />
            ),
          }}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {apiError && (
              <Typography color="error" sx={{ mt: 2 }}>
                {apiError}
              </Typography>
            )}
            
            {results.length > 0 && (
              <List>
                {results.map((city) => (
                  <ListItem
                    key={`${city.name}-${city.country}`}
                    secondaryAction={
                      <Button
                        onClick={() => handleSelect(city)}
                        size="small"
                        variant="outlined"
                      >
                        Add
                      </Button>
                    }
                  >
                    <ListItemText
                      primary={`${city.name}, ${city.country}`}
                      secondary={city.timezone}
                    />
                  </ListItem>
                ))}
              </List>
            )}
            
            {apiResults.length > 0 && (
              <List>
                {apiResults.map((city) => (
                  <ListItem
                    key={`${city.name}-${city.country}`}
                    secondaryAction={
                      <Button
                        onClick={() => handleSelect(city)}
                        size="small"
                        variant="outlined"
                      >
                        Add
                      </Button>
                    }
                  >
                    <ListItemText
                      primary={`${city.name}, ${city.country}`}
                      secondary={city.timezone}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

// Helper function to format timezone IDs to match IANA format
function formatTimezone(timezone: string): string {
  // Convert to lowercase and replace spaces with underscores
  return timezone.toLowerCase().replace(/ /g, '_');
}
