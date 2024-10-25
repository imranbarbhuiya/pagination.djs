import common from 'eslint-config-mahir/common';
import node from 'eslint-config-mahir/node';
import tsdoc from 'eslint-config-mahir/tsdoc';
import typescript from 'eslint-config-mahir/typescript';

/**
 * @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigArray}
 */
export default [
	...common,
	...node,
	...typescript,
	...tsdoc,
	{
		languageOptions: {
			parserOptions: {
				projectService: {
					allowDefaultProject: ['eslint.config.mjs', 'tsup.config.ts', 'example/index.ts'],
					defaultProject: 'tsconfig.base.json'
				},
				tsconfigRootDir: import.meta.dirname
			}
		},
		rules: {
			'jsdoc/valid-types': 'off'
		}
	},
	{
		ignores: ['.github', '.yarn', 'dist']
	}
];
