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
			// The repo indents .vue with tabs (see .editorconfig).
			'vue/html-indent': ['warn', 'tab'],
			'vue/script-indent': ['warn', 'tab', { baseIndent: 0 }],
			'vue/max-attributes-per-line': 'off',
			'vue/singleline-html-element-content-newline': 'off',
			// Optional props are already expressed by the TS type; a runtime
			// default would only make `undefined` unreachable.
			'vue/require-default-prop': 'off',
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		},
	},
)
