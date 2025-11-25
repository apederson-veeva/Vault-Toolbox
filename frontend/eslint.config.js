const js = require('@eslint/js');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const importPlugin = require('eslint-plugin-import');
const jsxA11yPlugin = require('eslint-plugin-jsx-a11y');
const babelParser = require('@babel/eslint-parser');

module.exports = [
    {
        ignores: ['node_modules/', 'build/', 'dist/', 'coverage/', '*.config.js'],
    },
    js.configs.recommended,
    {
        files: ['**/*.{js,jsx}'],
        languageOptions: {
            globals: {
                window: true,
                document: true,
                localStorage: true,
                sessionStorage: true,
                fetch: true,
                performance: true,
                process: true,
                require: true,
                module: true,
                chrome: true,
                FormData: true,
                TextEncoder: true,
                URL: true,
                URLSearchParams: true,
                Response: true,
                setInterval: true,
                clearInterval: true,
                clearTimeout: true,
                setTimeout: true,
                navigator: true,
                console: true,
                Blob: true,
            },
            parser: babelParser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                ecmaVersion: 'latest',
                sourceType: 'module',
                requireConfigFile: false,
                babelOptions: {
                    presets: ['@babel/preset-react'],
                },
            },
        },
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
            import: importPlugin,
            'jsx-a11y': jsxA11yPlugin,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            // General
            'no-console': ['warn', { allow: ['error'] }],
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'react/jsx-uses-vars': 'error',

            // React
            'react/prop-types': 'off',
            'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],
            'react/self-closing-comp': 'warn',
            'react/jsx-boolean-value': ['warn', 'never'],

            // React Hooks
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',

            // Import
            'import/order': [
                'warn',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                    alphabetize: { order: 'asc' },
                },
            ],
            'import/no-unresolved': 'off',

            // JSX Accessibility
            'jsx-a11y/anchor-is-valid': 'warn',
            'jsx-a11y/click-events-have-key-events': 'warn',
        },
    },
];
