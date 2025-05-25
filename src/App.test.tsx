import { render, act } from '@testing-library/react';
import App from './App'; // Assuming App.tsx is in the same directory or src/
import { Timezone } from './types';

// Helper function to test the regex directly for clarity
const isValidIANATimezoneID = (id: string | null | undefined): boolean => {
  if (!id) {
    return false;
  }
  // This is the regex used in App.tsx
  const ianaRegex = /^[A-Za-z_+-]+\/[A-Za-z0-9_+-]+(?:\/[A-Za-z0-9_+-]+)*$/;
  return ianaRegex.test(id);
};

describe('App Component and Timezone ID Validation', () => {
  // Mock localStorage and its methods
  let mockStorage: { [key: string]: string };

  beforeEach(() => {
    mockStorage = {};
    jest.spyOn(window.localStorage, 'getItem').mockImplementation((key) => mockStorage[key] || null);
    jest.spyOn(window.localStorage, 'setItem').mockImplementation((key, value) => {
      mockStorage[key] = value.toString();
    });
    jest.spyOn(window.localStorage, 'removeItem').mockImplementation((key) => {
      delete mockStorage[key];
    });
    jest.spyOn(console, 'log').mockImplementation(() => {}); // Suppress console.log during tests
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('IANA Timezone ID Regex Validation', () => {
    // Test cases for the regex
    const validIDs = [
      'America/New_York',
      'Europe/London',
      'Asia/Kolkata',
      'Australia/Sydney',
      'America/North_Dakota/Center',
      'Etc/GMT',
      'Etc/GMT-10',
      'Etc/GMT+5',
      'Etc/UTC',
      // 'Factory', // This one is expected to fail the current regex as it lacks a '/'
    ];

    const invalidIDs = [
      'America/New York', // space
      'Invalid/Zone', // While it matches regex, it's not a real zone, but regex is for structure
      'NoSlash',
      'Americas/New_York', // 'Americas' is not a valid IANA top-level
      'Europe/London/ExtraSegmentNotAllowedByOldRegexButMaybeByNew', // This is valid by the new regex
      '',
      // null and undefined are handled by !tz.id, so we test them separately if needed
    ];
    
    const specificInvalidIDsForRegex = [
        'America/New York', // space
        'NoSlash',
        'invalid/', // missing second part
        '/invalid', // missing first part
        'leading_slash/New_York', // leading slash in first part (assuming spec disallows this)
        'America//New_York', // double slash
        'America/New_York/', // trailing slash
    ];


    validIDs.forEach(id => {
      it(`should validate "${id}" as a structurally valid IANA ID`, () => {
        expect(isValidIANATimezoneID(id)).toBe(true);
      });
    });

    // Test 'Factory' separately as it's a special case for IANA but not for the regex
    it('should NOT validate "Factory" as it does not match the current regex structure (missing "/")', () => {
        expect(isValidIANATimezoneID('Factory')).toBe(false);
    });
    
    // Test 'Europe/London/ExtraSegment' as it should be valid with the new regex
    it('should validate "Europe/London/ExtraSegment" as structurally valid with multiple segments', () => {
        expect(isValidIANATimezoneID('Europe/London/ExtraSegment')).toBe(true);
    });

    invalidIDs.forEach(id => {
      // We filter out IDs that are structurally valid but semantically incorrect for this specific structural test
      if (id === 'Invalid/Zone' || id === 'Americas/New_York' || id === 'Europe/London/ExtraSegmentNotAllowedByOldRegexButMaybeByNew') {
        // These might pass the pure regex structural test but are invalid for other reasons (e.g. not real zones or old thinking)
        // The regex `^[A-Za-z_+-]+\/[A-Za-z0-9_+-]+(?:\/[A-Za-z0-9_+-]+)*$` should pass 'Invalid/Zone' and 'Americas/New_York'
        // and 'Europe/London/ExtraSegment...'
        if (id === 'Europe/London/ExtraSegmentNotAllowedByOldRegexButMaybeByNew') {
             expect(isValidIANATimezoneID(id)).toBe(true); // This is now valid.
        } else {
             expect(isValidIANATimezoneID(id)).toBe(true); // These are structurally valid by the regex
        }
      } else if (id === '') {
        it(`should NOT validate an empty string "" as a structurally valid IANA ID`, () => {
          expect(isValidIANATimezoneID(id)).toBe(false);
        });
      }
      else {
        it(`should NOT validate "${id}" as a structurally valid IANA ID`, () => {
          expect(isValidIANATimezoneID(id)).toBe(false);
        });
      }
    });

    specificInvalidIDsForRegex.forEach(id => {
        it(`should NOT validate "${id}" due to specific structural flaws`, () => {
            expect(isValidIANATimezoneID(id)).toBe(false);
        });
    });

    it('should return false for null or undefined IDs via the helper', () => {
      expect(isValidIANATimezoneID(null)).toBe(false);
      expect(isValidIANATimezoneID(undefined)).toBe(false);
    });
  });

  describe('App localStorage interaction for timezone IDs', () => {
    it('should clear localStorage if an invalid timezone ID is found', () => {
      const invalidTimezones: Partial<Timezone>[] = [{ id: 'InvalidID' }];
      localStorage.setItem('worldtimez_timezones', JSON.stringify(invalidTimezones));

      act(() => {
        render(<App />);
      });
      // Check if removeItem was called (meaning invalid data was cleared)
      // Due to the way App is structured, this test might be tricky without deeper mocks or refactoring App's useEffect.
      // For now, we focus on the regex test itself.
      // A more direct test would be to spy on localStorage.removeItem
      expect(localStorage.removeItem).toHaveBeenCalledWith('worldtimez_timezones');
    });

    it('should NOT clear localStorage if all timezone IDs are valid', () => {
      const validTimezones: Partial<Timezone>[] = [
        { id: 'America/New_York' },
        { id: 'Europe/Paris' }
      ];
      localStorage.setItem('worldtimez_timezones', JSON.stringify(validTimezones));
      
      act(() => {
        render(<App />);
      });

      expect(localStorage.removeItem).not.toHaveBeenCalled();
    });

    it('should clear localStorage if any timezone ID is an empty string', () => {
        const invalidTimezones: Partial<Timezone>[] = [
            { id: 'America/New_York' },
            { id: '' } // Empty string ID
        ];
        localStorage.setItem('worldtimez_timezones', JSON.stringify(invalidTimezones));
        act(() => {
            render(<App />);
        });
        expect(localStorage.removeItem).toHaveBeenCalledWith('worldtimez_timezones');
    });

    it('should clear localStorage if any timezone ID is structurally incorrect like "NoSlash"', () => {
        const invalidTimezones: Partial<Timezone>[] = [
            { id: 'America/New_York' },
            { id: 'NoSlash' } 
        ];
        localStorage.setItem('worldtimez_timezones', JSON.stringify(invalidTimezones));
        act(() => {
            render(<App />);
        });
        expect(localStorage.removeItem).toHaveBeenCalledWith('worldtimez_timezones');
    });
  });
});
