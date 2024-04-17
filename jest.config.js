module.exports = {
	preset: 'ts-jest',
	verbose: true,
	testMatch: ['**/**.spec.ts'],
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	testTimeout: 60000,
	setupFiles: ['dotenv/config'],
	testEnvironment: './src/jest-setup/jest-allure-environment.ts',
}
