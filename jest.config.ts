import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  globalSetup: '<rootDir>/tests/globalSetup.ts',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    // process `*.tsx` files with `ts-jest`
  },
  moduleNameMapper: {
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tests/fileMock.ts',
    '\\.(css|less)$': '<rootDir>/tests/fileMock.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
  moduleDirectories: ['node_modules', 'src'],
  roots: ['<rootDir>'],
  modulePaths: ['<rootDir>'],
};

export default config;
