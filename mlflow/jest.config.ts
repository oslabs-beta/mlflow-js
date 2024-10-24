import type { Config } from '@jest/types';
const config: Config.InitialOptions = {
  preset: 'ts-jest', // allows Jest to handle TS files without requiring to transpile them first
  testEnvironment: 'node', // appropriate for most Node.js and TS projects
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  roots: ['<rootDir>/src', '<rootDir>/tests/'],
  moduleNameMapper: { '^@utils/(.*)$': '<rootDir>/src/utils/$1' },
  moduleFileExtensions: ['ts', 'js'],
  moduleDirectories: ['node_modules', 'src'],
};
export default config;
