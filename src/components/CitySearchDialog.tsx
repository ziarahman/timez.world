import { useState, useEffect } from 'react';
import { Timezone } from '../types';
import { cityService } from '../services/CityService';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  List, 
  ListItem as MuiListItem,
  ListItemText,
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  ToggleButton,
  ToggleButtonGroup,
  Box,
  CircularProgress,
  InputAdornment,
  TextField,
  SelectChangeEvent
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

  useEffect(() => {
    if (open) {
      setLoading(true);
      
      if (searchQuery.trim() === '') {
        try {
          const staticCitiesMap = cityService.getStaticCities();
          let initialCities = Array.from(staticCitiesMap.values());

          if (selectedRegion !== 'all') {
            const regionPrefix = selectedRegion === 'americas' ? 'America/' : 
                               selectedRegion === 'oceania' ? 'Australia/' : 
                               `${selectedRegion.charAt(0).toUpperCase()}${selectedRegion.slice(1)}/`;
            
            initialCities = initialCities.filter(city => 
              city.timezone.startsWith(regionPrefix)
            );
          }
          
          setResults(initialCities);
          setApiResults([]);
          setApiError(null);
        } catch (error) {
          console.error('Failed to load initial cities:', error);
          setResults([]);
          setApiError('Failed to load initial cities.');
        } finally {
          setLoading(false);
        }
      } else {
        cityService.searchCities(searchQuery, selectedRegion)
          .then(cities => {
            setResults(cities);
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

  const handleSelect = (city: City) => {
    // Use the timezone as the ID since it's unique and IANA-compliant
    
    const timezone: Timezone = {
      id: city.timezone,
      name: `${city.name}, ${city.country}`,
      city: city.name,
      country: city.country,
      timezone: city.timezone ? formatTimezone(city.timezone) : 'Etc/Unknown',
      latitude: city.latitude,
      longitude: city.longitude,
      population: city.population,
      offset: city.offset
    };

    onCitySelect(timezone);
    onClose();
  };

  const handleRegionChange = (event: SelectChangeEvent<string>) => {
    setSelectedRegion(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleLiveLookupToggle = (event: React.MouseEvent<HTMLElement>, value: boolean) => {
    setLiveLookup(value);
  };

  const formatTimezone = (timezone: string): string => {
    if (timezone.includes('/')) {
      return timezone;
    }
    const cityParts = timezone.split(',');
    const cityName = cityParts[0].trim();
    const country = cityParts[1]?.trim();
    const availableTimezones = getAvailableTimezones();
    const matchingTimezone = availableTimezones.find(tz => 
      tz.city.toLowerCase() === cityName.toLowerCase() && 
      tz.country.toLowerCase() === country?.toLowerCase()
    );
    return matchingTimezone?.id || 'Etc/Unknown';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Timezone</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search cities..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <ToggleButtonGroup
            value={liveLookup}
            exclusive
            onChange={handleLiveLookupToggle}
            size="small"
          >
            <ToggleButton value={false}>
              Static
            </ToggleButton>
            <ToggleButton value={true}>
              <ApiIcon /> Live
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Region</InputLabel>
            <Select
              value={selectedRegion}
              onChange={handleRegionChange}
              label="Region"
            >
              {regions.map((region) => (
                <MenuItem key={region.id} value={region.id}>
                  {region.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <CircularProgress />
          </Box>
        )}

        <List>
          {results.map((city) => (
            <MuiListItem
              key={city.id}
              onClick={() => handleSelect(city)}
              sx={{ cursor: 'pointer' }}
            >
              <ListItemText
                primary={`${city.name}, ${city.country}`}
                secondary={city.timezone}
              />
            </MuiListItem>
          ))}

          {apiResults.length > 0 && (
            <MuiListItem>
              <ListItemText
                primary="API Results"
                secondary="Cities found via live lookup"
              />
            </MuiListItem>
          )}

          {apiResults.map((city) => (
            <MuiListItem
              key={city.id}
              onClick={() => handleSelect(city)}
              sx={{ cursor: 'pointer' }}
            >
              <ListItemText
                primary={`${city.name}, ${city.country}`}
                secondary={city.timezone}
              />
            </MuiListItem>
          ))}

          {apiError && (
            <MuiListItem>
              <ListItemText
                primary="Error"
                secondary={apiError}
              />
            </MuiListItem>
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
