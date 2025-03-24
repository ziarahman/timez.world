import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useRef } from 'react'
import { Box, IconButton, Paper, Tooltip, Typography, useTheme } from '@mui/material'
import { DateTime } from 'luxon'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import DeleteIcon from '@mui/icons-material/Delete'
import HomeIcon from '@mui/icons-material/Home'
import { Timezone } from '../types'

interface SortableTimezoneRowProps {
  timezone: Timezone
  selectedTime: DateTime
  onTimeSelect: (time: DateTime) => void
  onDelete: () => void
  onSetHome: () => void
  isHome?: boolean
}

export default function SortableTimezoneRow({
  timezone,
  selectedTime,
  onTimeSelect,
  onDelete,
  onSetHome,
  isHome = false
}: SortableTimezoneRowProps) {
  const theme = useTheme()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `${timezone.id}_${timezone.city}`,
    data: timezone
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  }

  // Convert selected time to this timezone
  const localTime = selectedTime.setZone(timezone.id)
  const currentDate = localTime.toFormat('ccc, MMM d')

  // Get reference time in UTC
  const utcTime = selectedTime.toUTC()

  const sliderRef = useRef<HTMLDivElement>(null)

  // Center the selected time slot when it changes
  useEffect(() => {
    const sliderElement = sliderRef.current
    if (!sliderElement) return

    const selectedElement = sliderElement.querySelector('[data-selected=true]') as HTMLElement
    if (selectedElement) {
      const scrollLeft = selectedElement.offsetLeft - (sliderElement.offsetWidth / 2) + (selectedElement.offsetWidth / 2)
      sliderElement.scrollTo({ left: scrollLeft, behavior: 'smooth' })
    }
  }, [selectedTime])

  // Generate time slots centered around the selected time
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hourOffset = i - 12
    const utcSlotTime = utcTime.plus({ hours: hourOffset })
    const localSlotTime = utcSlotTime.setZone(timezone.id)
    
    if (!localSlotTime.isValid) {
      console.error(`Invalid time for timezone ${timezone.id}:`, { utcSlotTime, hourOffset })
      return null
    }
    
    const selectedInUTC = selectedTime.toUTC()
    
    // Create both hour and half-hour slots
    const slots = []
    
    // Create the hour slot
    const hourSlot = localSlotTime.set({ minute: 0 })
    const hourSlotInUTC = hourSlot.toUTC()
    slots.push({
      hour: hourSlot.hour,
      minute: 0,
      period: hourSlot.toFormat('a'),
      dateTime: hourSlot,
      isSelected: hourSlotInUTC.toFormat('HH:mm') === selectedInUTC.toFormat('HH:mm'),
      key: `${hourSlot.toFormat('HH')}-${hourOffset}`
    })
    
    // Create the half-hour slot
    const halfHourSlot = hourSlot.plus({ minutes: 30 })
    const halfHourSlotInUTC = halfHourSlot.toUTC()
    slots.push({
      hour: halfHourSlot.hour,
      minute: 30,
      period: halfHourSlot.toFormat('a'),
      dateTime: halfHourSlot,
      isSelected: halfHourSlotInUTC.toFormat('HH:mm') === selectedInUTC.toFormat('HH:mm'),
      key: `${halfHourSlot.toFormat('HH')}-${hourOffset}-30`
    })
    
    return slots
  }).flat().filter((slot): slot is NonNullable<typeof slot> => slot !== null)

  return (
    <Paper 
      ref={setNodeRef}
      style={style}
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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            size="small"
            {...attributes}
            {...listeners}
            sx={{ mr: 1, cursor: 'grab' }}
          >
            <DragIndicatorIcon fontSize="small" />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
              {`${timezone.country}/${timezone.city}`}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              (UTC{timezone.offset >= 0 ? '+' : '-'}
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
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title={isHome ? 'Home timezone' : 'Set as home timezone'}>
              <IconButton 
                size="small" 
                onClick={onSetHome}
                color={isHome ? 'primary' : 'default'}
                sx={{
                  p: 0.5,
                  ...(isHome && {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    }
                  })
                }}
              >
                <HomeIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {!isHome && (
              <Tooltip title="Remove timezone">
                <IconButton 
                  size="small" 
                  onClick={onDelete}
                  sx={{ p: 0.5 }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Box>
      <Box
        ref={sliderRef}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 0.5,
          py: 0.5,
          px: 1,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          msOverflowStyle: 'none',
          scrollBehavior: 'smooth',
          position: 'relative',
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            width: '50%',
            height: '1px',
            pointerEvents: 'none'
          }
        }}
      >
        {timeSlots.map((slot) => (
          <Box
            key={slot.key}
            data-selected={slot.isSelected}
            onClick={() => onTimeSelect(slot.dateTime)}
            sx={{
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.75rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              bgcolor: slot.isSelected ? 'primary.main' : 'transparent',
              color: slot.isSelected ? 'primary.contrastText' : 'text.primary',
              '&:hover': {
                bgcolor: slot.isSelected 
                  ? 'primary.dark' 
                  : theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(0, 0, 0, 0.08)',
              },
              transition: theme.transitions.create(['background-color', 'color']),
            }}
          >
            {slot.hour === 0 ? '12' : slot.hour > 12 ? slot.hour - 12 : slot.hour}
            {slot.minute > 0 ? `:${slot.minute.toString().padStart(2, '0')}` : ':00'} 
            {slot.period}
          </Box>
        ))}
      </Box>
    </Paper>
  )
}
