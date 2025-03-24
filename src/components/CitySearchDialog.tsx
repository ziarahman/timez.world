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
  Typography
} from '@mui/material';
import { db, CityRecord } from '../db/CityDatabase';
import { getAvailableTimezones } from '../data/timezones';
import { TimezoneCity } from '../data/timezones';

interface CitySearchDialogProps {
  open: boolean;
  onClose: () => void;
  onCitySelect: (city: TimezoneCity) => void;
}

export default function CitySearchDialog({ open, onClose, onCitySelect }: CitySearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CityRecord[]>([]);
  const [totalCities, setTotalCities] = useState<number>(0);
  const [staticCities] = useState(() => new Set(
    getAvailableTimezones().map(city => `${city.city}|${city.country}`)
  ));

  // Load total city count when dialog opens
  useEffect(() => {
    if (open) {
      db.getTotalCityCount().then(count => setTotalCities(count));
    }
  }, [open]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const searchResults = await db.searchCities(query);
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

  const handleSelect = (city: CityRecord) => {
    const timezoneCity: TimezoneCity = {
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
        Search Additional Cities
        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
          {totalCities.toLocaleString()} cities available in the database
        </Typography>
      </DialogTitle>
      <DialogContent>
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
              <ListItem disablePadding key={`${city.name}-${city.country}`}>
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
