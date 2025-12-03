/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@veil/types$': '<rootDir>/../../packages/types/src',
        '^@veil/zcash$': '<rootDir>/../../packages/zcash/src',
        '^@veil/crypto$': '<rootDir>/../../packages/crypto/src',
        '^@veil/config$': '<rootDir>/../../packages/config/src',
    },
    setupFiles: ['<rootDir>/jest.setup.js'],
};
