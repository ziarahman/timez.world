import { useEffect, useRef } from 'react'
import { Box, useTheme } from '@mui/material'
import { DateTime } from 'luxon'

interface TimeSlot {
  hour: number
  minute: number
  period: string
  dateTime: DateTime
  isSelected: boolean
  key: string
}

interface TimeSliderProps {
  timeSlots: TimeSlot[]
  onTimeSelect: (time: DateTime) => void
}

export default function TimeSlider({ timeSlots, onTimeSelect }: TimeSliderProps) {
  const theme = useTheme()
  const sliderRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Center the selected time slot when it changes
  useEffect(() => {
    const selectedSlot = timeSlots.find(slot => slot.isSelected)
    if (selectedSlot && sliderRef.current && containerRef.current) {
      const sliderElement = sliderRef.current
      const selectedElement = sliderElement.children[timeSlots.indexOf(selectedSlot) + 1] as HTMLElement
      if (selectedElement) {
        // Calculate the center position
        const containerWidth = containerRef.current.offsetWidth
        const selectedWidth = selectedElement.offsetWidth
        const selectedLeft = selectedElement.offsetLeft
        const scrollLeft = selectedLeft - (containerWidth / 2) + (selectedWidth / 2)
        
        // Ensure smooth scrolling
        sliderElement.scrollTo({ left: scrollLeft, behavior: 'smooth' })
      }
    }
  }, [timeSlots])

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
      }}
    >
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
          '-ms-overflow-style': 'none',
          scrollBehavior: 'smooth',
          // Add padding to allow center alignment
          '&::before, &::after': {
            content: '""',
            flex: '0 0 50%',
            minWidth: '50%'
          }
        }}
      >
        {timeSlots.map((slot) => (
          <Box
            key={slot.key}
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
            {':00 '}
            {slot.period}
          </Box>
        ))}
      </Box>
    </Box>
  )
}
