import { useState } from 'react';
import { 
  Autocomplete, 
  TextField, 
  Box,
  IconButton,
  InputAdornment,
  Typography,
  ListItem,
  ListItemText,
} from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import AddIcon from '@mui/icons-material/Add';
import { DateTime } from 'luxon';
import { Timezone } from '../types';
import { getAvailableTimezones } from '../data/timezones';
import CitySearchDialog from './CitySearchDialog';

interface TimezonePickerProps {
  onSelect: (timezone: Timezone) => void;
}

export default function TimezonePicker({ onSelect }: TimezonePickerProps) {

  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState<Timezone | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Get static list of popular cities
  const options = getAvailableTimezones();

  const handleCitySelect = (city: Timezone) => {
    setValue(city);
    onSelect({
      ...city,
      offset: DateTime.now().setZone(city.id).offset
    });
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Autocomplete
        value={value}
        onChange={(_, newValue) => {
          if (newValue) {
            handleCitySelect(newValue);
          }
        }}
        inputValue={inputValue}
        onInputChange={(_, newValue) => setInputValue(newValue)}
        options={options}
        getOptionLabel={(option) => `${option.city}, ${option.country}`}
        filterOptions={(options, { inputValue }) => {
          // If no input, show top 20 popular cities
          if (!inputValue) return options.slice(0, 20);
          
          const searchTerm = inputValue.toLowerCase().trim();
          if (searchTerm.length < 2) return options.slice(0, 20);
          
          // Show cities that match the search term
          return options.filter(option => 
            option.city.toLowerCase().includes(searchTerm) ||
            option.country.toLowerCase().includes(searchTerm)
          );
        }}
        autoComplete
        autoHighlight
        autoSelect
        disablePortal={false}
        openOnFocus
        selectOnFocus
        renderOption={(props, option) => {
          // Calculate offset once per option
          const offset = option.offset || DateTime.local().setZone(option.id).toFormat('ZZ');
          // Create a unique key using both city name and timezone ID
          const key = `${option.city}-${option.country}-${option.id}`;
          return (
            <ListItem {...props} key={key}>
              <ListItemText
                primary={
                  <Typography variant="body1">
                    {option.city}, {option.country}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {option.id} (UTC{offset})
                  </Typography>
                }
              />
            </ListItem>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select or search for a city"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <PublicIcon color="action" />
                </InputAdornment>
              )
            }}
          />
        )}
        sx={{ width: 300 }}
        ListboxProps={{
          sx: {
            maxHeight: 300
          }
        }}
      />
      
      <IconButton 
        onClick={() => setDialogOpen(true)}
        color="primary"
        title="Search more cities"
      >
        <AddIcon />
      </IconButton>

      <CitySearchDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCitySelect={handleCitySelect}
      />
    </Box>
  );
}
