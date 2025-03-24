import { useState, useEffect } from 'react'
import { DateTime } from 'luxon'
import { initializeDatabase } from './db/DataLoader'
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
import AboutDialog from './components/AboutDialog'
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

// Storage key for timezones
const STORAGE_KEY = 'worldtimez_timezones'

// Load timezones from localStorage
function loadSavedTimezones(): Timezone[] {
  try {
    const savedTimezones = localStorage.getItem(STORAGE_KEY)
    return savedTimezones ? JSON.parse(savedTimezones) : []
  } catch (error) {
    console.error('Error loading saved timezones:', error)
    return []
  }
}

// Save timezones to localStorage
function saveTimezones(timezones: Timezone[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timezones))
  } catch (error) {
    console.error('Error saving timezones:', error)
  }
}

function App() {
  const [dbInitialized, setDbInitialized] = useState(false)

  // Initialize the database
  useEffect(() => {
    initializeDatabase().then(() => setDbInitialized(true))
  }, [])
  const prefersDarkSystem = useMediaQuery('(prefers-color-scheme: dark)')
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(
    localStorage.getItem('theme') as 'light' | 'dark' || (prefersDarkSystem ? 'dark' : 'light')
  )
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false)

  // Clear localStorage if there are any invalid timezone IDs
  useEffect(() => {
    try {
      const savedTimezones = localStorage.getItem(STORAGE_KEY)
      if (savedTimezones) {
        const tzs = JSON.parse(savedTimezones)
        const hasInvalidId = tzs.some((tz: Timezone) => tz.id.includes('_'))
        if (hasInvalidId) {
          localStorage.removeItem(STORAGE_KEY)
          window.location.reload()
        }
      }
    } catch (error) {
      console.error('Error checking timezone IDs:', error)
    }
  }, [])

  const [selectedDateTime, setSelectedDateTime] = useState(DateTime.local())
  const [timezones, setTimezones] = useState<Timezone[]>(loadSavedTimezones())

  // Add user's local timezone if no timezones exist
  useEffect(() => {
    if (timezones.length === 0) {
      const localZone = DateTime.local().zoneName
      if (localZone) {
        const zoneParts = localZone.split('/')
        const localTimezone: Timezone = {
          id: localZone,
          name: localZone,
          offset: DateTime.local().offset,
          city: zoneParts[zoneParts.length - 1].replace(/_/g, ' '),
          country: zoneParts[0].replace(/_/g, ' '),
          population: 0
        }
        setTimezones([localTimezone])
      }
    }
  }, [])

  // Save timezones whenever they change
  useEffect(() => {
    saveTimezones(timezones)
  }, [timezones])

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
    console.log('Saving timezones:', timezones)
    saveTimezones(timezones)
  }, [timezones])

  const handleAddTimezone = (selectedTimezone: Timezone) => {
    console.log('Adding timezone:', selectedTimezone)

    // Check if timezone already exists
    if (timezones.some(tz => tz.id === selectedTimezone.id && tz.name === selectedTimezone.name)) {
      console.log('Timezone already exists')
      return
    }

    const newTimezones = [...timezones, selectedTimezone]
    console.log('Setting new timezones:', newTimezones)
    setTimezones(newTimezones)
  }

  const handleDeleteTimezone = (timezoneToDelete: Timezone) => {
    console.log('Deleting timezone:', timezoneToDelete)
    
    const newTimezones = timezones.filter(tz => 
      !(tz.id === timezoneToDelete.id && tz.name === timezoneToDelete.name)
    )
    
    console.log('New timezones:', newTimezones)
    setTimezones(newTimezones)
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
                <Tooltip title="About Worldtimez">
                  <IconButton onClick={() => setAboutDialogOpen(true)}>
                    <PublicIcon sx={{ fontSize: 32, color: '#2196F3' }} />
                  </IconButton>
                </Tooltip>
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
              <AboutDialog 
                open={aboutDialogOpen} 
                onClose={() => setAboutDialogOpen(false)} 
              />
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
                <Box sx={{ flex: { xs: '1', sm: '1' }, width: '100%' }}>
                  <Typography 
                    variant="subtitle1" 
                    component="h2" 
                    sx={{ mb: 1, fontWeight: 500 }}
                  >
                    Time Settings
                  </Typography>
                  <Box sx={{ 
                    '& .MuiTextField-root': { width: '100%' },
                    '& .MuiInputBase-root': { width: '100%' },
                    '& .MuiFormControl-root': { width: '100%' }
                  }}>
                    <DateTimePicker
                      label="Select Date & Time"
                      value={selectedDateTime}
                      onChange={(newValue) => {
                        if (newValue) {
                          setSelectedDateTime(newValue)
                        }
                      }}
                    />
                  </Box>
                </Box>
                
                <Box sx={{ flex: { xs: '1', sm: '1' }, width: '100%' }}>
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
                  onTimeSelect={handleTimeSelect}
                  onDelete={handleDeleteTimezone}
                  onReorder={setTimezones}
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
