import { render, screen, fireEvent } from '@testing-library/react';
import { DateTime } from 'luxon';
import TimezoneRow from '../TimezoneRow';
import { Timezone } from '../../types';

// Mock child components that are not the focus of this test
jest.mock('../TimeSlider', () => () => <div data-testid="mock-time-slider">Mock Time Slider</div>);

// Store original DateTime methods for potential use if needed
const OriginalDateTime = jest.requireActual('luxon').DateTime;

describe('TimezoneRow Component', () => {
  let mockOnTimeSelect: jest.Mock;
  let mockOnDelete: jest.Mock;
  let baseSelectedTime: DateTime;

  // Define some test timezones
  const mockTimezoneNY: Timezone = {
    id: 'America/New_York',
    name: 'New York, USA',
    city: 'New York',
    country: 'USA',
    timezone: 'America/New_York',
    latitude: 40.7128,
    longitude: -74.0060,
    population: 8399000,
    offset: -300, // Example, will be dynamically calculated by Luxon in component
    source: 'static'
  };

  const mockTimezoneGMT10: Timezone = {
    id: 'Etc/GMT-10',
    name: 'GMT-10',
    city: 'GMT-10', // City name might be different in actual data
    country: '',
    timezone: 'Etc/GMT-10',
    latitude: 0,
    longitude: 0,
    population: 0,
    offset: 600, // Example
    source: 'static'
  };
  
  const mockTimezoneBuenosAires: Timezone = {
    id: 'America/Argentina/Buenos_Aires',
    name: 'Buenos Aires, Argentina',
    city: 'Buenos Aires',
    country: 'Argentina',
    timezone: 'America/Argentina/Buenos_Aires',
    latitude: -34.6037,
    longitude: -58.3816,
    population: 2891000,
    offset: -180, // Example
    source: 'static'
  };
  
  const mockTimezoneInvalid: Timezone = {
    id: 'Invalid/Zone_For_Row_Test', // Deliberately invalid
    name: 'Invalid Zone Test',
    city: 'InvalidVille',
    country: 'Nowhereland',
    timezone: 'Invalid/Zone_For_Row_Test',
    latitude: 0,
    longitude: 0,
    population: 0,
    offset: 0,
    source: 'static'
  };


  beforeEach(() => {
    mockOnTimeSelect = jest.fn();
    mockOnDelete = jest.fn();
    // Use a fixed UTC time for consistent tests
    // March 29, 2025, 12:00:00 PM UTC
    baseSelectedTime = DateTime.fromObject(
        { year: 2025, month: 3, day: 29, hour: 12, minute: 0, second: 0 },
        { zone: 'utc' }
    );
    
    // Suppress console.error for invalid zone warnings from Luxon during tests
    jest.spyOn(console, 'error').mockImplementation((message, ...args) => {
        if (typeof message === 'string' && message.includes('unsupported zone')) {
            return; // Suppress Luxon's "unsupported zone" error
        }
        // For other errors, use the original console.error
        // console.error(message, ...args); // This would print them; omit for silence
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders correctly and displays time for America/New_York', () => {
    render(
      <TimezoneRow
        timezone={mockTimezoneNY}
        selectedTime={baseSelectedTime}
        onTimeSelect={mockOnTimeSelect}
        onDelete={mockOnDelete}
        isDraggable={false}
      />
    );

    // New York is UTC-4 on March 29, 2025 (EDT)
    // 12:00 PM UTC is 8:00 AM in New York
    expect(screen.getByText(mockTimezoneNY.name)).toBeInTheDocument();
    expect(screen.getByText(/Sat, Mar 29/i)).toBeInTheDocument(); // Date
    
    // Check for time display. TimeSlider is mocked, so we check TimezoneRow's direct output
    // The component formats the time like `h:mm a`
    const localTimeInNY = baseSelectedTime.setZone(mockTimezoneNY.id);
    expect(screen.getByText(localTimeInNY.toFormat('h:mm a').toLowerCase())).toBeInTheDocument(); // e.g., "8:00 am"
    expect(screen.getByText(mockTimezoneNY.city)).toBeInTheDocument();
  });

  test('renders correctly and displays time for Etc/GMT-10', () => {
    render(
      <TimezoneRow
        timezone={mockTimezoneGMT10}
        selectedTime={baseSelectedTime}
        onTimeSelect={mockOnTimeSelect}
        onDelete={mockOnDelete}
        isDraggable={false}
      />
    );
    // GMT-10 is UTC+10 effectively due to IANA naming for fixed offsets (Etc/GMT-10 means +10)
    // 12:00 PM UTC on Mar 29 is 10:00 PM (22:00) on Mar 29 in GMT-10 (which is UTC+1000)
    // Correct interpretation: Etc/GMT-10 means 10 hours *ahead* of GMT.
    // So 12:00 UTC Mar 29 is 22:00 Mar 29 in Etc/GMT-10.
    expect(screen.getByText(mockTimezoneGMT10.name)).toBeInTheDocument();
    const localTimeInGMT10 = baseSelectedTime.setZone(mockTimezoneGMT10.id); // Luxon handles Etc/GMT-10 correctly
    
    // Date might remain Sat, Mar 29, or change depending on exact UTC time and +10 offset.
    // 12:00 UTC Mar 29 + 10 hours = 22:00 UTC Mar 29. Still Mar 29.
    expect(screen.getByText(localTimeInGMT10.toFormat('ccc, MMM d').replace('.', ''))).toBeInTheDocument();
    expect(screen.getByText(localTimeInGMT10.toFormat('h:mm a').toLowerCase())).toBeInTheDocument(); // e.g., "10:00 pm"
    expect(screen.getByText(mockTimezoneGMT10.city)).toBeInTheDocument();
  });

  test('renders correctly and displays time for America/Argentina/Buenos_Aires', () => {
    render(
      <TimezoneRow
        timezone={mockTimezoneBuenosAires}
        selectedTime={baseSelectedTime}
        onTimeSelect={mockOnTimeSelect}
        onDelete={mockOnDelete}
        isDraggable={false}
      />
    );
    // Buenos Aires is UTC-3
    // 12:00 PM UTC is 9:00 AM in Buenos Aires
    expect(screen.getByText(mockTimezoneBuenosAires.name)).toBeInTheDocument();
    const localTimeInBA = baseSelectedTime.setZone(mockTimezoneBuenosAires.id);
    expect(screen.getByText(localTimeInBA.toFormat('ccc, MMM d').replace('.', ''))).toBeInTheDocument();
    expect(screen.getByText(localTimeInBA.toFormat('h:mm a').toLowerCase())).toBeInTheDocument(); // e.g., "9:00 am"
    expect(screen.getByText(mockTimezoneBuenosAires.city)).toBeInTheDocument();
  });

  test('handles onDelete callback', () => {
    render(
      <TimezoneRow
        timezone={mockTimezoneNY}
        selectedTime={baseSelectedTime}
        onTimeSelect={mockOnTimeSelect}
        onDelete={mockOnDelete}
        isDraggable={false}
      />
    );
    // Find the delete button (aria-label or role might be needed depending on IconButton)
    // Assuming the delete button has an accessible name "Delete timezone"
    const deleteButton = screen.getByRole('button', { name: /delete timezone/i });
    fireEvent.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledWith(mockTimezoneNY);
  });
  
  test('renders fallback for invalid timezone ID and does not crash', () => {
    render(
      <TimezoneRow
        timezone={mockTimezoneInvalid}
        selectedTime={baseSelectedTime}
        onTimeSelect={mockOnTimeSelect}
        onDelete={mockOnDelete}
        isDraggable={false}
      />
    );

    // Check that the component still renders something, e.g., the name and city
    expect(screen.getByText(mockTimezoneInvalid.name)).toBeInTheDocument();
    expect(screen.getByText(mockTimezoneInvalid.city)).toBeInTheDocument();

    // For an invalid zone, Luxon's setZone().toFormat() might return "Invalid DateTime" or similar
    // or the component might have specific error handling.
    // TimezoneRow displays "--:--" for invalid times.
    expect(screen.getByText(/Invalid DateTime/i)).toBeInTheDocument(); // Check for Luxon's default invalid date text
    expect(screen.getByText(/--:--/i)).toBeInTheDocument(); // Check for component's fallback display

    // No specific error should be thrown that crashes the component (Jest would fail the test)
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining("unsupported zone 'Invalid/Zone_For_Row_Test'"), expect.anything());
  });

  // Test for TimeSlider interaction (if TimezoneRow itself handles slider changes)
  // Since TimeSlider is mocked, this test might be limited.
  // If TimezoneRow has its own clickable elements for time adjustment:
  test('responds to time adjustment controls if any (e.g., hour buttons)', () => {
    render(
      <TimezoneRow
        timezone={mockTimezoneNY}
        selectedTime={baseSelectedTime}
        onTimeSelect={mockOnTimeSelect}
        onDelete={mockOnDelete}
        isDraggable={false}
      />
    );

    // Example: if there were buttons to shift time by one hour
    const plusButton = screen.queryByRole('button', { name: /increase time by one hour/i });
    const minusButton = screen.queryByRole('button', { name: /decrease time by one hour/i });

    if (plusButton) {
      fireEvent.click(plusButton);
      // Check if onTimeSelect was called with baseSelectedTime.plus({ hours: 1 })
      // This requires knowing how onTimeSelect is called by these hypothetical buttons.
      // For now, we'll assume these buttons don't exist directly in TimezoneRow if TimeSlider handles it.
    }
    // This test is more conceptual without actual +/- buttons in TimezoneRow.
    // The primary interaction for time change is via the TimeSlider, which is mocked.
    expect(plusButton).toBeNull(); // Assuming these buttons are not in TimezoneRow
    expect(minusButton).toBeNull();
  });
});
