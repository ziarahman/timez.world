import { DateTime } from 'luxon'
import { Timezone } from '../types'
import { 
  Box, 
  Typography, 
  IconButton, 
  ButtonBase, 
  useTheme,
  Paper,
  Tooltip
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import DarkModeIcon from '@mui/icons-material/DarkMode'

interface TimezoneRowProps {
  timezone: Timezone;
  selectedTime: DateTime;
  onTimeSelect: (time: DateTime) => void;
  onDelete: (timezone: Timezone) => void;
}

export default function TimezoneRow({ 
  timezone, 
  selectedTime, 
  onTimeSelect, 
  onDelete
}: TimezoneRowProps) {
  // Convert selected time to this timezone
  const localTime = selectedTime.setZone(timezone.id)
  const currentDate = localTime.toFormat('ccc, MMM d')

  // Get reference time in UTC
  const utcTime = selectedTime.toUTC()

  // Generate time slots centered around the selected time
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    // Calculate offset from UTC hour (-12 to +11)
    const hourOffset = i - 12
    // Add offset to UTC time to get the time slot
    const utcSlotTime = utcTime.plus({ hours: hourOffset })
    // Convert UTC time to local timezone
    const localSlotTime = utcSlotTime.setZone(timezone.id)
    
    if (!localSlotTime.isValid) {
      console.error(`Invalid time for timezone ${timezone.id}:`, { utcSlotTime, hourOffset })
      return null
    }
    
    return {
      hour: localSlotTime.hour,
      minute: 0,
      period: localSlotTime.toFormat('a'),
      dateTime: localSlotTime,
      isSelected: hourOffset === 0,
      key: localSlotTime.toFormat('HH:mm')
    }
  }).filter((slot): slot is NonNullable<typeof slot> => slot !== null)

  const theme = useTheme()

  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        py: 0.5,
        px: 1,
        borderRadius: 1,
        background: theme.palette.background.paper,
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 0.5
      }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
              {timezone.city}, {timezone.country}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {timezone.id} (UTC{timezone.offset >= 0 ? '+' : '-'}
              {Math.floor(Math.abs(timezone.offset) / 60).toString().padStart(2, '0')}:
              {(Math.abs(timezone.offset) % 60).toString().padStart(2, '0')})
            </Typography>
          </Box>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 0.5,
          ml: 1
        }}>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            {currentDate}
          </Typography>
          <Tooltip title="Remove timezone">
            <IconButton
              onClick={() => onDelete(timezone)}
              size="small"
              color="error"
              sx={{ 
                padding: 0.5,
                '&:hover': { 
                  backgroundColor: theme.palette.error.main + '1A'
                },
                '& .MuiSvgIcon-root': {
                  fontSize: '0.875rem'
                }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Box 
        sx={{ 
          display: 'flex',
          gap: 0.5,
          overflowX: 'auto',
          pb: 0.5,
          px: 0.5,
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': {
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: theme.palette.action.hover,
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.primary.main + '80',
            borderRadius: '4px',
            '&:hover': {
              background: theme.palette.primary.main,
            },
          },
        }}
        ref={(el: HTMLDivElement | null) => {
          if (el) {
            // Find the selected time slot and scroll it into view
            const selectedSlot = el.children[12] as HTMLElement // Middle slot (index 12 of 24)
            if (selectedSlot) {
              selectedSlot.scrollIntoView({ 
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
              })
            }
          }
        }}
      >
        {timeSlots.map((slot) => (
          <ButtonBase
            key={slot.key}
            onClick={() => onTimeSelect(slot.dateTime)}
            sx={{
              minWidth: '85px',
              height: '48px',
              py: 0.5,
              px: 1,
              borderRadius: 1,
              textAlign: 'center',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              ...(slot.isSelected && {
                backgroundColor: theme.palette.primary.main + '1A',
                color: theme.palette.primary.main,
                fontWeight: 500,
              }),
              '&:hover': {
                backgroundColor: slot.isSelected 
                  ? theme.palette.primary.main + '33'
                  : theme.palette.action.hover,
              },
            }}
          >
            <Typography 
              variant="caption" 
              component="div"
              sx={{ 
                lineHeight: 1.2,
                fontWeight: slot.isSelected ? 600 : 400
              }}
            >
              {slot.dateTime.toFormat('h:mm a')}
            </Typography>
            {slot.dateTime.hour >= 6 && slot.dateTime.hour < 18 ? (
              <WbSunnyIcon 
                sx={{ 
                  fontSize: 16, 
                  color: slot.isSelected ? 'primary.main' : 'warning.main',
                  opacity: slot.isSelected ? 1 : 0.7
                }} 
              />
            ) : (
              <DarkModeIcon 
                sx={{ 
                  fontSize: 16, 
                  color: slot.isSelected ? 'primary.main' : 'info.main',
                  opacity: slot.isSelected ? 1 : 0.7
                }} 
              />
            )}
          </ButtonBase>
        ))}
      </Box>
    </Paper>
  )
}
