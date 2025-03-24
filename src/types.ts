export interface Timezone {
  id: string;
  name: string;
  city: string;
  country: string;
  population: number;
  offset: number;
}

export interface TimeSlot {
  hour: number;
  minute: number;
  period: 'AM' | 'PM';
}
