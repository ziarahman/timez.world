import '@testing-library/jest-dom';

// Mock Luxon DateTime
jest.mock('luxon', () => ({
  DateTime: {
    now: jest.fn(() => ({
      year: 2025,
      month: 3,
      day: 29,
      hour: 19,
      minute: 30,
      second: 0,
      zone: 'Asia/Singapore',
      isValid: true,
      setZone: jest.fn().mockReturnThis(),
      toFormat: jest.fn().mockReturnValue('2025-03-29T19:30:00+08:00'),
    })),
    fromObject: jest.fn((obj) => ({
      ...obj,
      isValid: true,
      setZone: jest.fn().mockReturnThis(),
      toFormat: jest.fn().mockReturnValue('2025-03-29T19:30:00+08:00'),
    })),
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    key: (index: number) => Object.keys(store)[index] || null,
    length: Object.keys(store).length,
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
