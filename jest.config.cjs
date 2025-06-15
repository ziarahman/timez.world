module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@mocks/(.*)$': '<rootDir>/src/__tests__/__mocks__/$1',
    '^@types$': '<rootDir>/src/types'
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      // AST transformers to handle import.meta.env
      astTransformers: {
        before: [
          {
            path: 'ts-jest-mock-import-meta',
            options: { metaObjectReplacement: { env: { VITE_GEO_DB_API_URL: 'mocked-api-url-for-jest' } } }
          }
        ]
      }
    }]
  },
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts']
};
