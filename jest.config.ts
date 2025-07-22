import type { Config } from 'jest'

const config: Config = {
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  verbose: true,
  moduleNameMapper: {
    '^@vqueue/sdk(.*)$': '<rootDir>/src$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
}

export default config
