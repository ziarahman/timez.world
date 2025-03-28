import { useState, useEffect } from 'react';
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
  MenuItem
} from '@mui/material';
import { getAvailableTimezones } from '../data/timezones';
import { cityService, City } from '../services/CityService';
import { Timezone } from '../types';

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
  const [totalCities, setTotalCities] = useState<number>(0);
  const [staticCities] = useState(() => new Set(
    getAvailableTimezones().map(city => `${city.city}|${city.country}`)
  ));

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
          setTotalCities(cities.length + staticCities.size);
          if (selectedRegion !== 'all') {
            setResults(cities);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [open, selectedRegion, staticCities.size]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2 && selectedRegion === 'all') {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const searchResults = await cityService.searchCities(query, selectedRegion);
      // Filter out cities that are already in the static list
      const filteredResults = searchResults.filter(city => 
        !staticCities.has(`${city.name}|${city.country}`)
      );
      setResults(filteredResults);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (city: City) => {
    const timezoneCity: Timezone = {
      id: city.timezone,
      name: `${city.name}, ${city.country}`,
      city: city.name,
      country: city.country,
      population: city.population,
      offset: 0 // This will be calculated by the parent component
    };
    onCitySelect(timezoneCity);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          Search Additional Cities
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {totalCities.toLocaleString()} cities available in the database
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
          >
            {regions.map((region) => (
              <MenuItem key={region.id} value={region.id}>
                {region.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          autoFocus
          margin="dense"
          label="Search by city or country name"
          fullWidth
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          variant="outlined"
        />
        {loading ? (
          <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
        ) : results.length > 0 ? (
          <List sx={{ mt: 2 }}>
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
          </List>
        ) : searchQuery.length >= 2 ? (
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            No cities found matching your search
          </Typography>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
