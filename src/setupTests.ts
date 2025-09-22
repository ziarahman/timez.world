import '@testing-library/jest-dom';

// Provide deterministic Luxon behaviour while preserving full API support
jest.mock('luxon', () => {
  const actual = jest.requireActual('luxon');
  const fixedNow = actual.DateTime.fromISO('2025-03-29T19:30:00+08:00');
  const originalLocal = actual.DateTime.local.bind(actual.DateTime);
  const originalFromObject = actual.DateTime.fromObject.bind(actual.DateTime);

  actual.DateTime.now = jest.fn(() => fixedNow);
  actual.DateTime.local = jest.fn((...args: any[]) => originalLocal(...args));
  actual.DateTime.fromObject = jest.fn((config: any, options?: any) => originalFromObject(config, options));

  return {
    ...actual,
    DateTime: actual.DateTime,
  };
});

if (!HTMLElement.prototype.scrollIntoView) {
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    value: jest.fn(),
    configurable: true,
  });
}

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
