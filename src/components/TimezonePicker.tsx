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

const normalizeKeyword = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[＋﹢]/g, '+')
    .replace(/[‐‑‒–—−﹣－]/g, '-')
    .replace(/\s+/g, '');

const getTimezoneAliases = (timezoneId?: string): string[] => {
  if (!timezoneId) {
    return [];
  }

  const aliases = new Set<string>();
  const normalizedId = timezoneId.trim();

  if (normalizedId === 'UTC' || normalizedId === 'Etc/UTC') {
    ['UTC', 'GMT', 'UTC+0', 'UTC-0', 'UTC+00', 'UTC-00', 'UTC+00:00', 'UTC-00:00'].forEach(alias =>
      aliases.add(alias)
    );
    return Array.from(aliases);
  }

  if (normalizedId === 'Etc/GMT') {
    ['UTC', 'GMT', 'UTC+0', 'UTC-0', 'UTC+00', 'UTC-00', 'UTC+00:00', 'UTC-00:00', 'GMT+0', 'GMT-0'].forEach(alias =>
      aliases.add(alias)
    );
    return Array.from(aliases);
  }

  const etcMatch = normalizedId.match(/^Etc\/GMT([+-])(\d{1,2})$/i);
  if (!etcMatch) {
    return [];
  }

  const [, sign, hours] = etcMatch;
  const actualSign = sign === '-' ? '+' : '-';
  const paddedHours = hours.padStart(2, '0');

  [
    `UTC${actualSign}${hours}`,
    `UTC${actualSign}${paddedHours}`,
    `UTC${actualSign}${hours}:00`,
    `UTC${actualSign}${paddedHours}:00`,
    `GMT${actualSign}${hours}`,
    `GMT${actualSign}${paddedHours}`,
    `GMT${actualSign}${hours}:00`,
    `GMT${actualSign}${paddedHours}:00`,
    'UTC',
    'GMT'
  ].forEach(alias => aliases.add(alias));

  return Array.from(aliases);
};

const buildNormalizedKeywords = (option: Timezone): string[] => {
  const keywords = new Set<string>();
  const timezoneId = option.id || option.timezone;

  const addKeyword = (value?: string | null) => {
    if (value) {
      keywords.add(normalizeKeyword(value));
    }
  };

  addKeyword(option.city);
  addKeyword(option.country);
  addKeyword(option.name);
  addKeyword(option.timezone);
  addKeyword(option.id);

  if (timezoneId) {
    addKeyword(timezoneId.replace(/_/g, ' '));
    timezoneId.split(/[\/_]/).forEach(part => addKeyword(part));
    getTimezoneAliases(timezoneId).forEach(addKeyword);
  }

  return Array.from(keywords);
};

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
        filterOptions={(options: readonly Timezone[], { inputValue }: { inputValue: string }) => {
          if (inputValue.length < 2) {
            const targetRegionMap: { [key: string]: string } = {
              Asia: 'Asia',
              America: 'Americas',
              Europe: 'Europe',
              Africa: 'Africa',
              Australia: 'Oceania',
              Pacific: 'Oceania',
              // Antarctica is a valid IANA prefix, but not in the target regions
              // Etc is also valid, but not geographical
            };

            const getRegionFromId = (id: string): string | null => {
              const prefix = id.split('/')[0];
              return targetRegionMap[prefix] || null;
            };

            const regionalTopCities: Timezone[] = [];
            // Use a Set to ensure each target region is processed once
            const processedTargetRegions = new Set<string>(); 

            // Iterate over the *values* of targetRegionMap to get unique target region names
            Object.values(targetRegionMap).forEach(targetRegionName => {
              if (processedTargetRegions.has(targetRegionName)) {
                return; 
              }

              const citiesInRegion = options.filter(option => {
                const region = getRegionFromId(option.id);
                return region === targetRegionName;
              });

              const top5ForRegion = citiesInRegion
                .sort((a, b) => b.population - a.population)
                .slice(0, 5);
              
              regionalTopCities.push(...top5ForRegion);
              processedTargetRegions.add(targetRegionName);
            });
            
            return regionalTopCities;
          }

          const normalizedSearchTerm = normalizeKeyword(inputValue);

          if (!normalizedSearchTerm) {
            return [...options];
          }

          return options.filter(option =>
            buildNormalizedKeywords(option).some(keyword => keyword.includes(normalizedSearchTerm))
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
