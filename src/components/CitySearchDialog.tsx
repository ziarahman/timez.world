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
  CircularProgress,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { Cloud as ApiIcon } from '@mui/icons-material';
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
      setLoading(true);
      
      // If search query is empty, load initial static cities
      if (searchQuery.trim() === '') {
        try {
          const staticCitiesMap = cityService.getStaticCities();
          let initialCities = Array.from(staticCitiesMap.values());

          // Filter by region if a specific region is selected
          if (selectedRegion !== 'all') {
            initialCities = initialCities.filter(city => 
              city.timezone.startsWith(selectedRegion)
            );
          }
          
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
            timezone: city.timezone ? formatTimezone(city.timezone) : 'Etc/Unknown'
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
    onCitySelect({
      id: city.id || `${city.city}/${city.country}`,
      name: `${city.name}, ${city.country}`,
      city: city.city || city.name,
      country: city.country,
      timezone: city.timezone ? formatTimezone(city.timezone) : 'Etc/Unknown',
      latitude: city.latitude,
      longitude: city.longitude,
      population: city.population || 0,
      offset: city.offset ?? 0,
    });
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Region</InputLabel>
              <Select
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.target.value as string);
                  // Clear search query when changing region
                  setSearchQuery('');
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

            <FormControl fullWidth>
              <InputLabel>Live Lookup</InputLabel>
              <Select
                value={liveLookup ? 'enabled' : 'disabled'}
                onChange={(e) => handleLiveLookupChange()}
                label="Live Lookup"
                startAdornment={
                  <InputAdornment position="start">
                    <ApiIcon />
                  </InputAdornment>
                }
              >
                <MenuItem value="disabled">Disabled</MenuItem>
                <MenuItem value="enabled">Enabled</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for a city..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {apiError && (
                <Typography color="error" variant="body2" align="center">
                  {apiError}
                </Typography>
              )}
              <List>
                {results.map((city) => (
                  <ListItem
                    key={`${city.city}-${city.country}`}
                    button
                    onClick={() => handleSelect(city)}
                  >
                    <ListItemText
                      primary={`${city.city}, ${city.country}`}
                      secondary={city.timezone}
                    />
                  </ListItem>
                ))}
                {apiResults.map((city) => (
                  <ListItem
                    key={`${city.city}-${city.country}-api`}
                    button
                    onClick={() => handleSelect(city)}
                  >
                    <ListItemText
                      primary={`${city.city}, ${city.country}`}
                      secondary={city.timezone}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

// Helper function to format timezone IDs to match IANA format
function formatTimezone(timezone: string): string {
  return timezone;
}
