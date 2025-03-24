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
  useTheme
} from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import AddIcon from '@mui/icons-material/Add';
import { DateTime } from 'luxon';
import { getAvailableTimezones, TimezoneCity } from '../data/timezones';
import CitySearchDialog from './CitySearchDialog';

interface TimezonePickerProps {
  onSelect: (timezone: TimezoneCity) => void;
}

export default function TimezonePicker({ onSelect }: TimezonePickerProps) {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState<TimezoneCity | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Get static list of popular cities
  const options = getAvailableTimezones();

  const handleCitySelect = (city: TimezoneCity) => {
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
        renderOption={(props, option) => (
          <ListItem {...props}>
            <ListItemText
              primary={
                <Typography variant="body1">
                  {option.city}, {option.country}
                </Typography>
              }
              secondary={
                <Typography variant="caption" color="text.secondary">
                  {option.id} (UTC{DateTime.now().setZone(option.id).toFormat('ZZ')})
                </Typography>
              }
            />
          </ListItem>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select a city"
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
