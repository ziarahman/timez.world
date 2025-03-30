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
