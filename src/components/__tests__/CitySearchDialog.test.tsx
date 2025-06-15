import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { DateTime } from 'luxon';
import CitySearchDialog from '../CitySearchDialog';
import { cityService } from '../../services/CityService';
import { CityApiService } from '../../services/CityApiService';
import { Timezone } from '../../types';

// Mock services
jest.mock('../../services/CityService');
jest.mock('../../services/CityApiService');

// Mock Luxon's DateTime behavior for offset calculation
jest.mock('luxon', () => {
  const ActualLuxon = jest.requireActual('luxon');
  return {
    ...ActualLuxon,
    DateTime: {
      ...ActualLuxon.DateTime,
      local: jest.fn(() => ({
        setZone: jest.fn((zoneId: string) => {
          if (zoneId === 'Europe/Amsterdam') {
            return { isValid: true, offset: 60 };
          }
          if (zoneId === 'Etc/Unknown') {
            return { isValid: true, offset: 0 };
          }
          if (zoneId === 'Invalid/Zone_Test') {
            return { isValid: false, offset: NaN };
          }
          if (zoneId === 'Europe/London') { // For the API city test
            return { isValid: true, offset: 0 };
          }
          // Fallback for any other zone, try to use actual logic if needed or provide a default
          const actualDt = ActualLuxon.DateTime.local().setZone(zoneId);
          return { isValid: actualDt.isValid, offset: actualDt.offset };
        }),
      })),
    },
  };
});

describe('CitySearchDialog Component', () => {
  let mockOnClose: jest.Mock;
  let mockOnCitySelect: jest.Mock;

  const mockCityAmsterdam = {
    id: 'europe-amsterdam-static', // This is the internal ID from service
    name: 'Amsterdam',
    city: 'Amsterdam', // Assuming city field is present
    country: 'Netherlands',
    timezone: 'Europe/Amsterdam', // This is the IANA ID
    latitude: 52.37,
    longitude: 4.89,
    population: 821752,
    offset: 0 // This will be recalculated
    // No source property for a truly static city from local service perspective
  };

  const mockCityUnknownZone = {
    id: 'unknown-city-static',
    name: 'UnknownZoneCity',
    city: 'UnknownZoneCity',
    country: 'Atlantis',
    timezone: 'Etc/Unknown',
    latitude: 0,
    longitude: 0,
    population: 100,
    offset: 0,
    source: 'static'
  };
  
  const mockCityInvalidZone = {
    id: 'invalid-city-static',
    name: 'InvalidZoneCity',
    city: 'InvalidZoneCity',
    country: 'Nowhere',
    timezone: 'Invalid/Zone_Test', // An invalid IANA ID structure for testing offset
    latitude: 0,
    longitude: 0,
    population: 100,
    offset: 0,
    source: 'static'
  };


  beforeEach(() => {
    mockOnClose = jest.fn();
    mockOnCitySelect = jest.fn();

    // Reset service mocks
    (cityService.searchCities as jest.Mock).mockResolvedValue([mockCityAmsterdam]);
    (cityService.getStaticCities as jest.Mock).mockReturnValue(new Map([[mockCityAmsterdam.id, mockCityAmsterdam]]));
    (cityService.addDynamicCity as jest.Mock) = jest.fn(); // Mock addDynamicCity
    
    const mockApiServiceInstance = {
      searchCities: jest.fn().mockResolvedValue([]),
    };
    (CityApiService.getInstance as jest.Mock) = jest.fn().mockReturnValue(mockApiServiceInstance);
    
    // Suppress console.warn for invalid timezone ID during tests
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    // jest.restoreAllMocks(); // May not be needed if not using jest.spyOn for DateTime
    jest.clearAllMocks(); // Clear all mock call counts etc.
  });

  test('renders and allows searching for a city', async () => {
    (cityService.searchCities as jest.Mock).mockResolvedValueOnce([mockCityAmsterdam]);
    render(
      <CitySearchDialog open={true} onClose={mockOnClose} onCitySelect={mockOnCitySelect} />
    );

    const searchInput = screen.getByPlaceholderText('Search for a city...');
    fireEvent.change(searchInput, { target: { value: 'Amsterdam' } });

    // Wait for results to appear
    await waitFor(() => {
      expect(screen.getByText(`${mockCityAmsterdam.name}, ${mockCityAmsterdam.country}`)).toBeInTheDocument();
    });
  });

  test('handleSelect calls onCitySelect with correct IANA ID, timezone, and calculated offset', async () => {
    (cityService.getStaticCities as jest.Mock).mockReturnValue(new Map([['amsterdam', mockCityAmsterdam]]));
    // Ensure initial load (empty search) populates results for selection
     render(
      <CitySearchDialog open={true} onClose={mockOnClose} onCitySelect={mockOnCitySelect} />
    );
    
    // Wait for the initial list of cities to be populated (assuming Amsterdam is in initial list)
    // Or trigger a search if needed. For this test, assume it's available for click.
    // If dialog initially loads static cities and Amsterdam is one of them:
    await waitFor(() => {
        const cityItem = screen.getByText(`${mockCityAmsterdam.name}, ${mockCityAmsterdam.country}`);
        expect(cityItem).toBeInTheDocument();
        fireEvent.click(cityItem);
    });


    expect(mockOnCitySelect).toHaveBeenCalledTimes(1);
    const selectedTimezoneArg = mockOnCitySelect.mock.calls[0][0] as Timezone;

    expect(selectedTimezoneArg.id).toBe(mockCityAmsterdam.id);
    expect(selectedTimezoneArg.timezone).toBe('Europe/Amsterdam'); // This remains IANA ID
    expect(selectedTimezoneArg.name).toBe('Amsterdam, Netherlands');
    expect(selectedTimezoneArg.city).toBe('Amsterdam');
    expect(selectedTimezoneArg.country).toBe('Netherlands');
    expect(selectedTimezoneArg.offset).toBe(60); // Mocked offset for Europe/Amsterdam
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('handleSelect uses 0 offset for "Etc/Unknown" timezone', async () => {
     (cityService.getStaticCities as jest.Mock).mockReturnValue(new Map([['unknown', mockCityUnknownZone]]));
     render(
      <CitySearchDialog open={true} onClose={mockOnClose} onCitySelect={mockOnCitySelect} />
    );
    
    await waitFor(() => {
        const cityItem = screen.getByText(`${mockCityUnknownZone.name}, ${mockCityUnknownZone.country}`);
        expect(cityItem).toBeInTheDocument();
        fireEvent.click(cityItem);
    });

    expect(mockOnCitySelect).toHaveBeenCalledTimes(1);
    const selectedTimezoneArg = mockOnCitySelect.mock.calls[0][0] as Timezone;

    expect(selectedTimezoneArg.id).toBe(mockCityUnknownZone.id);
    expect(selectedTimezoneArg.timezone).toBe('Etc/Unknown');
    expect(selectedTimezoneArg.offset).toBe(0); // Default offset for Etc/Unknown
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
  
  test('handleSelect uses 0 offset and logs warning for invalid IANA ID', async () => {
    (cityService.getStaticCities as jest.Mock).mockReturnValue(new Map([['invalid', mockCityInvalidZone]]));
    render(
      <CitySearchDialog open={true} onClose={mockOnClose} onCitySelect={mockOnCitySelect} />
    );

    await waitFor(() => {
        const cityItem = screen.getByText(`${mockCityInvalidZone.name}, ${mockCityInvalidZone.country}`);
        expect(cityItem).toBeInTheDocument();
        fireEvent.click(cityItem);
    });
    
    expect(mockOnCitySelect).toHaveBeenCalledTimes(1);
    const selectedTimezoneArg = mockOnCitySelect.mock.calls[0][0] as Timezone;

    expect(selectedTimezoneArg.id).toBe(mockCityInvalidZone.id);
    expect(selectedTimezoneArg.timezone).toBe('Invalid/Zone_Test');
    expect(selectedTimezoneArg.offset).toBe(0); // Default offset due to invalid zone
    // jest.spyOn(console, 'warn').mockImplementation(() => {}); was removed, so re-enable or check if console output is an issue
    // For now, let's assume the console.warn is expected if the mock for it is not active.
    // If console.warn was re-enabled by clearing mocks, this check might be needed.
    // However, the primary focus is the ID. Let's ensure console.warn is properly handled if it causes issues.
    // For this change, I'll assume the console.warn mock in beforeEach is active or restored if needed.
    // The main point is to fix selectedTimezoneArg.id.
    // The console.warn spy should be active from beforeEach.
    expect(console.warn).toHaveBeenCalledWith("Invalid timezone ID for offset calculation: Invalid/Zone_Test");
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  // Test for API results if live lookup is enabled
  test('handleSelect processes API result correctly', async () => {
    const mockApiCity = {
      id: 'api-city-london', // API might have different ID structure initially
      name: 'London',
      city: 'London',
      country: 'United Kingdom',
      timezone: 'Europe/London', // IANA ID from API
      latitude: 51.5074,
      longitude: 0.1278,
      population: 8982000,
      offset: 0, // Original offset, will be updated
      source: 'api'
    };

    // Mock cityService to return empty for initial search to not find 'London'
    (cityService.searchCities as jest.Mock).mockResolvedValue([]);
    (cityService.getStaticCities as jest.Mock).mockReturnValue(new Map());


    // Mock API service to return London
    const mockApiServiceInstance = CityApiService.getInstance(); // Ensure this instance is used
    (mockApiServiceInstance.searchCities as jest.Mock).mockResolvedValue([mockApiCity]);


    // The module mock for Luxon should cover Europe/London based on its definition.
    // No need for specific spyOn here if module mock is comprehensive.

    render(
      <CitySearchDialog open={true} onClose={mockOnClose} onCitySelect={mockOnCitySelect} />
    );

    // Enable live lookup
    const liveLookupButton = screen.getByRole('button', { name: /Live Lookup/i });
    fireEvent.click(liveLookupButton);
    
    // Search for the city
    const searchInput = screen.getByPlaceholderText('Search for a city...');
    fireEvent.change(searchInput, { target: { value: 'London' } });

    await waitFor(() => {
      expect(screen.getByText(`${mockApiCity.name}, ${mockApiCity.country}`)).toBeInTheDocument();
    });

    // Click the API result
    fireEvent.click(screen.getByText(`${mockApiCity.name}, ${mockApiCity.country}`));

    expect(mockOnCitySelect).toHaveBeenCalledTimes(1);
    const selectedTimezoneArg = mockOnCitySelect.mock.calls[0][0] as Timezone;
    const expectedApiId = 'london_united_kingdom_api'; // Generated ID

    expect(selectedTimezoneArg.id).toBe(expectedApiId);
    expect(selectedTimezoneArg.timezone).toBe('Europe/London');
    expect(selectedTimezoneArg.offset).toBe(0); // Mocked offset for Europe/London
    expect(selectedTimezoneArg.source).toBe('api');

    // Verify addDynamicCity was called for API city
    expect(cityService.addDynamicCity).toHaveBeenCalledTimes(1);
    expect(cityService.addDynamicCity).toHaveBeenCalledWith(expect.objectContaining({
      id: expectedApiId, // Ensure the ID passed to addDynamicCity is the generated one
      name: 'London, United Kingdom',
      source: 'api'
    }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('handleSelect does NOT call addDynamicCity for static city', async () => {
    // Ensure cityService.searchCities returns our static city for the test
    (cityService.searchCities as jest.Mock).mockResolvedValue([mockCityAmsterdam]);
    // For initial load if needed, or direct search:
    (cityService.getStaticCities as jest.Mock).mockReturnValue(new Map([[mockCityAmsterdam.id, mockCityAmsterdam]]));


    render(
      <CitySearchDialog open={true} onClose={mockOnClose} onCitySelect={mockOnCitySelect} />
    );

    // Search for the static city to ensure it's displayed via search logic
    const searchInput = screen.getByPlaceholderText('Search for a city...');
    fireEvent.change(searchInput, { target: { value: 'Amsterdam' } });

    await waitFor(() => {
        const cityItem = screen.getByText(`${mockCityAmsterdam.name}, ${mockCityAmsterdam.country}`);
        expect(cityItem).toBeInTheDocument();
        fireEvent.click(cityItem);
    });

    expect(mockOnCitySelect).toHaveBeenCalledTimes(1);
    const selectedTimezoneArg = mockOnCitySelect.mock.calls[0][0] as Timezone;

    // Check that the selected city is indeed the static one (no source or source is 'static')
    expect(selectedTimezoneArg.id).toBe(mockCityAmsterdam.id);
    expect(selectedTimezoneArg.source).toBeUndefined();

    // Verify addDynamicCity was NOT called
    expect(cityService.addDynamicCity).not.toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
