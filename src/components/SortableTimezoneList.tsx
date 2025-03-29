import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Stack } from '@mui/material'
import { DateTime } from 'luxon'
import { Timezone, getTimezoneUniqueId } from '../types'
import SortableTimezoneRow from './SortableTimezoneRow.tsx'

interface SortableTimezoneListProps {
  timezones: Timezone[];
  selectedDateTime: DateTime;
  onTimeSelect: (time: DateTime) => void;
  onDelete: (timezone: Timezone) => void;
  onReorder: (newOrder: Timezone[]) => void;
}

export default function SortableTimezoneList({
  timezones,
  selectedDateTime,
  onTimeSelect,
  onDelete,
  onReorder
}: SortableTimezoneListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = timezones.findIndex(tz => getTimezoneUniqueId(tz) === active.id)
      const newIndex = timezones.findIndex(tz => getTimezoneUniqueId(tz) === over.id)
      
      if (oldIndex !== -1 && newIndex !== -1) {
        // Create a new array with the moved item
        const newTimezones = [...timezones]
        const [movedItem] = newTimezones.splice(oldIndex, 1)
        newTimezones.splice(newIndex, 0, movedItem)
        onReorder(newTimezones)
      }
    }
  }

  // Remove duplicate timezones based on unique ID
  const uniqueTimezones = Array.from(new Map(timezones.map(tz => 
    [getTimezoneUniqueId(tz), tz]
  )).values())

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={uniqueTimezones.map(tz => getTimezoneUniqueId(tz))}
        strategy={verticalListSortingStrategy}
      >
        <Stack spacing={1}>
          {uniqueTimezones.map((timezone) => (
            <SortableTimezoneRow
              key={getTimezoneUniqueId(timezone)}
              timezone={timezone}
              selectedTime={selectedDateTime}
              onTimeSelect={onTimeSelect}
              onDelete={() => onDelete(timezone)}
            />
          ))}
        </Stack>
      </SortableContext>
    </DndContext>
  )
}
