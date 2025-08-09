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
  // Normalize selected time to a Luxon DateTime instance
  const baseSelectedTime = (selectedTime && typeof (selectedTime as any).toUTC === 'function')
    ? (selectedTime as DateTime)
    : DateTime.now()

  // Convert selected time to this timezone
  const localTime = baseSelectedTime.setZone(timezone.id)
  const isZoneValid = localTime.isValid
  const currentDate = isZoneValid ? localTime.toFormat('ccc, MMM d') : 'Invalid DateTime'

  // Get reference time in UTC (use setZone to avoid env-specific toUTC issues)
  const utcTime = baseSelectedTime.setZone('utc')

  // Generate time slots centered around the selected time
  const timeSlots = isZoneValid
    ? Array.from({ length: 24 }, (_, i) => {
        const hourOffset = i - 12
        const utcSlotTime = utcTime.plus({ hours: hourOffset })
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
    : []

  if (!isZoneValid) {
    console.error(`unsupported zone '${timezone.id}'`, { timezone })
  }

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
              {timezone.name}
            </Typography>
            {timezone.city !== timezone.name && (
              <Typography variant="caption" color="text.secondary">
                {timezone.city}
              </Typography>
            )}
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
              aria-label="Delete timezone"
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
          if (el && timeSlots.length >= 13) {
            const selectedSlot = el.children[12] as HTMLElement
            if (selectedSlot && typeof (selectedSlot as any).scrollIntoView === 'function') {
              selectedSlot.scrollIntoView({ 
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
              })
            }
          }
        }}
      >
        {isZoneValid ? (
          timeSlots.map((slot) => (
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
                {slot.dateTime.toFormat('h:mm a').toLowerCase()}
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
          ))
        ) : (
          <ButtonBase
            disabled
            sx={{
              minWidth: '85px',
              height: '48px',
              py: 0.5,
              px: 1,
              borderRadius: 1,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              backgroundColor: theme.palette.action.hover,
            }}
          >
            <Typography variant="caption" component="div">--:--</Typography>
          </ButtonBase>
        )}
      </Box>
    </Paper>
  )
}
