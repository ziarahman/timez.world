module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/src/__tests__/$1',
    '^@mocks/(.*)$': '<rootDir>/src/__tests__/__mocks__/$1',
    '^@types$': '<rootDir>/src/types'
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      isolatedModules: true
    }]
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  moduleDirectories: ['node_modules', 'src'],
  modulePaths: ['<rootDir>/src'],
  testPathIgnorePatterns: ['/node_modules/']
};
