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
  Tooltip,
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

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1, 
      width: '100%',
      maxWidth: '100%',
      flex: 1
    }}>
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
          // If input is empty or has 1 character, show top 5 most populous cities
          if (inputValue.length < 2) {
            // Sort all options by population in descending order and take the top 5
            return options
              .sort((a, b) => b.population - a.population)
              .slice(0, 5);
          }
          
          // If input has 2 or more characters, apply existing filtering logic
          const searchTerm = inputValue.toLowerCase().trim();
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
                  <Tooltip title="Search cities">
                    <PublicIcon sx={{ color: 'action.active' }} />
                  </Tooltip>
                </InputAdornment>
              ),
              endAdornment: (
                <>
                  {params.InputProps.endAdornment}
                  <InputAdornment position="end">
                    <Tooltip title="Add new timezone">
                      <IconButton
                        onClick={handleDialogOpen}
                        size="small"
                        sx={{ ml: 1 }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                </>
              )
            }}
            fullWidth
            sx={{
              width: '100%',
              '& .MuiOutlinedInput-root': {
                width: '100%'
              }
            }}
          />
        )}
        sx={{
          width: '100%',
          maxWidth: '100%',
          flex: 1,
          '& .MuiAutocomplete-root': {
            width: '100%'
          }
        }}
      />
      <CitySearchDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCitySelect={handleCitySelect}
      />
    </Box>
  );
}
