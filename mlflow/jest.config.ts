import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
  moduleNameMapper: {
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@model-registry/(.*)$': '<rootDir>/src/model-registry/$1',
    '^@tracking/(.*)$': '<rootDir>/src/tracking/$1',
    '^@workflows/(.*)$': '<rootDir>/src/workflows/$1',
  },
  testTimeout: 30000,
};

export default config;