
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

  // Using the imported getTimezoneUniqueId function from types.ts

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = timezones.findIndex(tz => getTimezoneUniqueId(tz) === active.id)
      const newIndex = timezones.findIndex(tz => getTimezoneUniqueId(tz) === over.id)
      
      if (oldIndex !== -1 && newIndex !== -1) {
        console.log('Moving timezone from', oldIndex, 'to', newIndex)
        console.log('Old order:', timezones.map(tz => tz.city))
        // Create a new array with the moved item
        const newTimezones = [...timezones]
        const [movedItem] = newTimezones.splice(oldIndex, 1)
        newTimezones.splice(newIndex, 0, movedItem)
        console.log('New order:', newTimezones.map(tz => tz.city))
        onReorder(newTimezones)
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={timezones.map(tz => getTimezoneUniqueId(tz))}
        strategy={verticalListSortingStrategy}
      >
        <Stack spacing={1}>
          {timezones.map((timezone) => (
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
