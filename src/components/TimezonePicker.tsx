import { useState, useMemo } from 'react'
import { 
  Autocomplete, 
  TextField, 
  Box,
  Typography,
  ListItem,
  ListItemText,
  useTheme
} from '@mui/material'
import PublicIcon from '@mui/icons-material/Public'
import { DateTime } from 'luxon'
import { getAvailableTimezones, formatTimezoneName } from '../data/timezones'

interface TimezonePickerProps {
  onSelect: (timezone: Timezone) => void;
}

export default function TimezonePicker({ onSelect }: TimezonePickerProps) {
  const theme = useTheme()
  
  // Memoize the timezone list to avoid recalculation
  const timezones = useMemo(() => {
    const tz = getAvailableTimezones()
    // Sort by timezone ID first, then by city name
    return tz.sort((a, b) => {
      const idCompare = a.id.localeCompare(b.id)
      if (idCompare !== 0) return idCompare
      return a.city.localeCompare(b.city)
    })
  }, [])
  
  const [value, setValue] = useState<typeof timezones[0] | null>(null)

  return (
    <Autocomplete
      value={value}
      onChange={(_, newValue) => {
        setValue(newValue)
        if (newValue) {
          console.log('Selected timezone:', JSON.stringify(newValue, null, 2))
          onSelect(newValue)
        }
      }}
      options={timezones}
      getOptionLabel={(option) => `${option.city}, ${option.country}`}
      groupBy={(option) => option.id}
      renderGroup={(params) => (
        <div key={params.key}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ 
              px: 2,
              py: 0.5,
              display: 'block',
              backgroundColor: theme.palette.background.default
            }}
          >
            {params.group}
          </Typography>
          {params.children}
        </div>
      )}
      sx={{ width: '100%' }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search for a city..."
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                <PublicIcon color="action" sx={{ fontSize: 20 }} />
              </Box>
            )
          }}
        />
      )}
      renderOption={(props, option) => {
        const { key, ...otherProps } = props;
        return (
          <ListItem
            key={key}
            {...otherProps}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              py: 1,
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            }}
          >
            <ListItemText
              primary={
                <Typography variant="body1">
                  {option.city}, {option.country}
                </Typography>
              }
              secondary={
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  {option.id} (UTC{DateTime.now().setZone(option.id).toFormat('ZZ')})
                </Typography>
              }
            />
          </ListItem>
        );
      }}
      ListboxProps={{
        sx: {
          maxHeight: 300,
          '& .MuiAutocomplete-option': {
            padding: theme.spacing(1, 2)
          }
        }
      }}
    />
  )
}
