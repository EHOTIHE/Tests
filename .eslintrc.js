module.exports = {
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.json',
	},
	plugins: ['@typescript-eslint', 'jest'],
	rules: {
		'@typescript-eslint/explicit-function-return-type': 'error',
		'@typescript-eslint/no-unused-vars': 'error',
		'@typescript-eslint/require-await': 'error',
		'@typescript-eslint/no-floating-promises': 'off',
		'jest/valid-expect': [
			'error',
			{
				minArgs: 1,
				maxArgs: 2,
			},
		],
		'jest/expect-expect': ['warn'],
	},
}
