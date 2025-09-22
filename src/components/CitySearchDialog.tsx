import { useState, useEffect } from 'react';
import { DateTime } from 'luxon'; // Make sure DateTime is imported at the top of the file
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
  ToggleButtonGroup,
  Box,
  Typography,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { Cloud as ApiIcon } from '@mui/icons-material';
import { getAvailableTimezones, generateTimezoneAliases } from '../data/timezones';

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
  source?: string;
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
            // Get the timezone prefix for the selected region
            const regionPrefix = selectedRegion === 'americas' ? 'America/' : 
                               selectedRegion === 'oceania' ? 'Australia/' : 
                               `${selectedRegion.charAt(0).toUpperCase()}${selectedRegion.slice(1)}/`;
            
            initialCities = initialCities.filter(city => 
              city.timezone.startsWith(regionPrefix)
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
      
      // Ensure unique IDs for static results
      const uniqueStaticResults = filteredResults.map(city => ({
        ...city,
        id: `${city.name}-${city.country}-static`.toLowerCase().replace(/[^a-z0-9]/g, '_')
      }));
      
      setResults(uniqueStaticResults);

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

          // Ensure unique IDs for API results
          const uniqueApiResults = apiResultsWithTimezones.map(city => ({
            ...city,
            id: `${city.name}-${city.country}-${city.source || 'api'}`.toLowerCase().replace(/[^a-z0-9]/g, '_')
          }));

          // Filter out duplicates with static results
          const finalApiResults = uniqueApiResults.filter(apiCity => 
            !uniqueStaticResults.some(staticCity => 
              staticCity.name === apiCity.name && 
              staticCity.country === apiCity.country
            )
          );

          setApiResults(finalApiResults);
          setApiError(null);
        } catch (error) {
          console.error('API search failed:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            error: error
          });
          
          // Handle specific error cases
          if (error instanceof Error && error.message.includes('No API key available')) {
            setApiError('API key is missing. Please check your environment variables.');
          } else if (error instanceof Error && error.message.includes('401')) {
            setApiError('API authentication failed. Please check your API key.');
          } else {
            setApiError('API search failed. Please try again later.');
          }
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
      setApiError('Search failed. Please try again later.');
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
    const ianaTimezoneId = city.timezone ? formatTimezone(city.timezone) : 'Etc/Unknown';
    // Calculate the current offset using Luxon
    let currentOffset = 0; // Default offset
    if (ianaTimezoneId !== 'Etc/Unknown') {
      const zone = DateTime.local().setZone(ianaTimezoneId);
      if (zone.isValid) {
        currentOffset = zone.offset;
      } else {
        console.warn(`Invalid timezone ID for offset calculation: ${ianaTimezoneId}`);
      }
    }

    const cityToAdd: Timezone = {
      id: city.id, // Use the unique ID from the search result
      name: `${city.name}, ${city.country}`,
      city: city.city || city.name,
      country: city.country,
      timezone: ianaTimezoneId, // This is the IANA timezone string
      aliases: generateTimezoneAliases(ianaTimezoneId),
      latitude: city.latitude,
      longitude: city.longitude,
      population: city.population || 0,
      offset: currentOffset,
      source: city.source
    };

    // If the city is from an API source, add it to dynamic cities
    if (city.source) {
      cityService.addDynamicCity(cityToAdd);
    }

    onCitySelect(cityToAdd);
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
            <Select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value as string);
                // Clear search query when changing region
                setSearchQuery('');
              }}
            >
              {regions.map((region) => (
                <MenuItem key={region.id} value={region.id}>
                  {region.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <ToggleButtonGroup
            value={liveLookup ? 'live' : 'static'}
            exclusive
            onChange={handleLiveLookupChange}
          >
            <ToggleButton
              value="live"
              selected={liveLookup}
              sx={{ 
                textTransform: 'none',
                '&.Mui-selected': {
                  color: 'primary.main',
                  '& .MuiSvgIcon-root': {
                    color: 'primary.main'
                  }
                }
              }}
            >
              <ApiIcon sx={{ mr: 1 }} />
              Live Lookup
            </ToggleButton>
          </ToggleButtonGroup>
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
              {results.map((city, index) => (
                <ListItem
                  key={`${city.id}-${index}`}
                  button
                  onClick={() => handleSelect(city)}
                >
                  <ListItemText
                    primary={`${city.name}, ${city.country}`}
                    secondary={city.timezone}
                  />
                </ListItem>
              ))}
              {apiResults.map((city, index) => (
                <ListItem
                  key={`${city.id}-${index}`}
                  button
                  onClick={() => handleSelect(city)}
                >
                  <ListItemText
                    primary={`${city.name}, ${city.country}`}
                    secondary={city.timezone}
                  />
                </ListItem>
              ))}
            </List>
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
  return timezone;
}
