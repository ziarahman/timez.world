import { useState, useEffect } from 'react'
import { DateTime } from 'luxon'
import { 
  Container, 
  Paper, 
  Typography, 
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  useMediaQuery,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import PublicIcon from '@mui/icons-material/Public'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { DateTimePicker } from '@mui/x-date-pickers'
import TimezonePicker from './components/TimezonePicker'
import SortableTimezoneList from './components/SortableTimezoneList'
import { Timezone } from './types'
import { getAvailableTimezones } from './data/timezones'

// Storage keys
const STORAGE_KEYS = {
  TIMEZONES: 'worldtimez_timezones',
  HOME_TIMEZONE: 'worldtimez_home_timezone'
}

// Load timezones from localStorage
function loadSavedTimezones(): { timezones: Timezone[]; homeTimezone: Timezone } {
  try {
    const savedTimezones = localStorage.getItem(STORAGE_KEYS.TIMEZONES)
    const savedHomeTimezone = localStorage.getItem(STORAGE_KEYS.HOME_TIMEZONE)
    const localZone = DateTime.local().zoneName || 'UTC'
    const zoneParts = localZone.split('/')
    const defaultHome: Timezone = {
      id: localZone,
      name: localZone,
      offset: DateTime.local().offset,
      city: zoneParts[zoneParts.length - 1].replace('_', ' '),
      country: zoneParts.length > 1 ? zoneParts[0].replace('_', ' ') : 'Unknown',
      population: 0
    }
    
    return {
      timezones: savedTimezones ? JSON.parse(savedTimezones) : [],
      homeTimezone: savedHomeTimezone ? JSON.parse(savedHomeTimezone) : defaultHome
    }
  } catch (error) {
    console.error('Error loading saved timezones:', error)
    const localZone = DateTime.local().zoneName || 'UTC'
    const zoneParts = localZone.split('/')
    return { 
      timezones: [], 
      homeTimezone: {
        id: localZone,
        name: localZone,
        offset: DateTime.local().offset,
        city: zoneParts[zoneParts.length - 1].replace('_', ' '),
        country: zoneParts.length > 1 ? zoneParts[0].replace('_', ' ') : 'Unknown',
        population: 0
      }
    }
  }
}

// Save timezones to localStorage
function saveTimezones(timezones: Timezone[], homeTimezone: Timezone) {
  try {
    localStorage.setItem(STORAGE_KEYS.TIMEZONES, JSON.stringify(timezones))
    localStorage.setItem(STORAGE_KEYS.HOME_TIMEZONE, JSON.stringify(homeTimezone))
  } catch (error) {
    console.error('Error saving timezones:', error)
  }
}

function App() {
  const prefersDarkSystem = useMediaQuery('(prefers-color-scheme: dark)')
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(
    localStorage.getItem('theme') as 'light' | 'dark' || (prefersDarkSystem ? 'dark' : 'light')
  )

  // Clear localStorage if there are any invalid timezone IDs
  useEffect(() => {
    try {
      const savedTimezones = localStorage.getItem(STORAGE_KEYS.TIMEZONES)
      const savedHomeTimezone = localStorage.getItem(STORAGE_KEYS.HOME_TIMEZONE)

      let hasInvalidId = false

      if (savedTimezones) {
        const tzs = JSON.parse(savedTimezones)
        hasInvalidId = tzs.some((tz: Timezone) => tz.id.includes('_'))
      }

      if (savedHomeTimezone) {
        const home = JSON.parse(savedHomeTimezone)
        if (home.id.includes('_')) {
          hasInvalidId = true
        }
      }

      if (hasInvalidId) {
        localStorage.removeItem(STORAGE_KEYS.TIMEZONES)
        localStorage.removeItem(STORAGE_KEYS.HOME_TIMEZONE)
        window.location.reload()
      }
    } catch (error) {
      console.error('Error checking timezone IDs:', error)
    }
  }, [])

  const [selectedDateTime, setSelectedDateTime] = useState(DateTime.local())
  const [timezones, setTimezones] = useState<Timezone[]>([])
  const [homeTimezone, setHomeTimezone] = useState<Timezone | null>(null)

  // Load saved timezones on initial render
  useEffect(() => {
    const savedState = loadSavedTimezones()
    setTimezones(savedState.timezones)
    setHomeTimezone(savedState.homeTimezone)
  }, [])

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('theme', themeMode)
  }, [themeMode])

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light')
  }

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: '#2196f3',
      },
      secondary: {
        main: '#f50057',
      },
      background: {
        default: themeMode === 'dark' ? '#121212' : '#f5f5f5',
        paper: themeMode === 'dark' ? '#1e1e1e' : '#ffffff',
      },
    },
    shape: {
      borderRadius: 12,
    },
  })


  // Save timezones whenever they change
  useEffect(() => {
    if (homeTimezone) {
      console.log('Saving state:', {
        timezones: timezones.map(tz => tz.city),
        home: homeTimezone.city
      })
      saveTimezones(timezones, homeTimezone)
    }
  }, [timezones, homeTimezone])

  const handleAddTimezone = (selectedTimezone: Timezone) => {
    if (!homeTimezone) return

    console.log('Adding timezone:', selectedTimezone)
    console.log('Current timezones:', JSON.stringify(timezones, null, 2))
    console.log('Home timezone:', JSON.stringify(homeTimezone, null, 2))

    // Only check if timezone exists in the list
    const exists = timezones.some(tz => {
      const match = tz.id === selectedTimezone.id && tz.city === selectedTimezone.city;
      if (match) {
        console.log('Found matching timezone in list:', JSON.stringify(tz, null, 2));
      }
      return match;
    })

    if (exists) {
      console.log('City already exists in list')
      return
    }

    // If it's the home timezone, use that data to ensure consistency
    const dataToAdd = selectedTimezone.id === homeTimezone.id ? homeTimezone : selectedTimezone
    const newTimezones = [...timezones, dataToAdd];
    console.log('Setting new timezones:', JSON.stringify(newTimezones, null, 2))
    setTimezones(newTimezones)
  }

  const handleDeleteTimezone = (index: number) => {
    if (!homeTimezone) return

    const deletedTimezone = timezones[index]
    setTimezones(prev => prev.filter((_, i) => i !== index))
    
    // If we're deleting the home timezone, make the first remaining timezone the new home
    if (deletedTimezone.id === homeTimezone.id && timezones.length > 1) {
      const newHomeIndex = index === 0 ? 1 : 0
      setHomeTimezone(timezones[newHomeIndex])
      setTimezones(prev => prev.filter((_, i) => i !== newHomeIndex))
    }
  }

  const handleDeleteHomeTimezone = () => {
    if (timezones.length > 0) {
      const newHome = timezones[0]
      setHomeTimezone(newHome)
      setTimezones(prev => prev.slice(1))
    }
  }

  const handleTimeSelect = (time: DateTime) => {
    setSelectedDateTime(time)
  }

  const handleSetHomeTimezone = (timezone: Timezone) => {
    const oldHome = homeTimezone
    // Set the new home timezone first
    setHomeTimezone(timezone)
    // Update the list in a single operation
    setTimezones(prev => {
      // Remove the new home timezone from the list
      const withoutNew = prev.filter(tz => tz.id !== timezone.id || tz.city !== timezone.city)
      // Add the old home timezone if it exists
      return oldHome ? [...withoutNew, oldHome] : withoutNew
    })
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <Box sx={{ minHeight: '100vh', py: 3 }}>
          <Container maxWidth="md">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PublicIcon sx={{ fontSize: 32, color: '#2196F3' }} />
                <Typography 
                  variant="h4" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Worldtimez
                </Typography>
              </Box>
              <Tooltip title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}>
                <IconButton onClick={toggleTheme} color="primary">
                  {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton>
              </Tooltip>
            </Box>
            
            <Paper 
              elevation={3} 
              sx={{ 
                p: 2,
                borderRadius: 3,
                background: theme.palette.background.paper,
              }}
            >
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                sx={{ mb: 1 }}
              >
                <Box sx={{ flex: { xs: '1', sm: '3' }, width: '100%' }}>
                  <Typography 
                    variant="subtitle1" 
                    component="h2" 
                    sx={{ mb: 1, fontWeight: 500 }}
                  >
                    Home Timezone Settings
                  </Typography>
                  <Box>
                    <DateTimePicker
                      label="Select Date & Time"
                      value={selectedDateTime}
                      onChange={(newValue) => {
                        if (newValue) {
                          setSelectedDateTime(newValue)
                        }
                      }}
                      sx={{ width: '100%' }}
                    />
                  </Box>
                </Box>
                
                <Box sx={{ flex: { xs: '1', sm: '2' }, width: '100%' }}>
                  <Typography 
                    variant="subtitle1" 
                    component="h2" 
                    sx={{ mb: 1, fontWeight: 500 }}
                  >
                    Add Timezone
                  </Typography>
                  <Box>
                    <TimezonePicker onSelect={handleAddTimezone} />
                  </Box>
                </Box>
              </Stack>

              <Stack spacing={1}>
                <SortableTimezoneList
                  timezones={timezones}
                  selectedDateTime={selectedDateTime}
                  homeTimezone={homeTimezone}
                  onTimeSelect={handleTimeSelect}
                  onDelete={(index) => {
                    if (index === 0) {
                      handleDeleteHomeTimezone()
                    } else {
                      handleDeleteTimezone(index - 1)
                    }
                  }}
                  onSetHome={(timezone) => {
                    if (timezone.id !== homeTimezone.id) {
                      handleSetHomeTimezone(timezone)
                    }
                  }}
                  onReorder={(newOrder) => {
                    const [newHome, ...newTimezones] = newOrder
                    setHomeTimezone(newHome)
                    setTimezones(newTimezones)
                  }}
                />
              </Stack>
            </Paper>
          </Container>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App
