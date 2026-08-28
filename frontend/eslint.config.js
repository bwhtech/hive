import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'

export default tseslint.config(
	{ ignores: ['dist', 'node_modules', 'dev-dist'] },
	js.configs.recommended,
	...tseslint.configs.recommended,
	...pluginVue.configs['flat/recommended'],
	{
		files: ['**/*.{ts,vue}'],
		languageOptions: {
			globals: globals.browser,
			parserOptions: {
				parser: tseslint.parser,
				extraFileExtensions: ['.vue'],
			},
		},
		rules: {
			'vue/multi-word-component-names': 'off',
			// Prettier formats .vue end to end (see .prettierrc.json, and the
			// pre-commit hook). ESLint must not have an opinion on layout: the
			// two disagree on `switch` bodies and fight over every fix.
			'vue/html-indent': 'off',
			'vue/script-indent': 'off',
			'vue/html-self-closing': 'off',
			'vue/singleline-html-element-content-newline': 'off',
			'vue/max-attributes-per-line': 'off',
			// Optional props are already expressed by the TS type; a runtime
			// default would only make `undefined` unreachable.
			'vue/require-default-prop': 'off',
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		},
	},
)
