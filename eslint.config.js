const globals = require("globals");
const eslint = require('@eslint/js');
const tslint = require('typescript-eslint');
const babelParser = require('@babel/eslint-parser');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = tslint.config(
    {
        ignores: ['coverage/**', '**/*.d.ts', 'dist/**', 'src/main/public/**', 'src/main/types/**', 'jest.*config.js','**/**.min.js', 'src/main/views/govuk/**'],
    },
    eslint.configs.recommended,
    eslintConfigPrettier,
    {
        files: ['**/**.ts', '**/**.tsx'],
        plugins: {
            '@typescript-eslint': tslint.plugin,
        },
        extends: [
            ...tslint.configs.recommended,
        ],
        languageOptions: {
            ecmaVersion: 2018,
            sourceType: 'module',
            globals: {
                Atomics: 'readonly',
                SharedArrayBuffer: 'readonly',
                ...globals.node,
                ...globals.jest,
                ...globals.browser,
                Feature: 'readonly',
                Scenario: 'readonly',
                locate: 'readonly',
                secret: 'readonly',
                actor: 'readonly',
                DataTable: 'readonly',
                Data: 'readonly',
                CodeceptJS: 'readonly',
            },
            parser: tslint.parser,
            parserOptions: {
                project: true,
            },
        },
        rules: {
            'no-unused-vars': 'off',
            '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
            'linebreak-style': ['error', 'unix'],
            '@typescript-eslint/no-var-requires': 0,
            '@typescript-eslint/no-explicit-any': 0,
        },
    },
    {
        files: ['**/**.js', '**/**.jsx'],
        ...tslint.configs.disableTypeChecked,
    },
    {
        files: ['**/*.js', '**/*.jsx'],
        languageOptions: {
            ecmaVersion: 2018,
            sourceType: 'module',
            globals: {
                Atomics: 'readonly',
                SharedArrayBuffer: 'readonly',
                ...globals.node,
                ...globals.jest,
                ...globals.browser,
                ...globals.commonjs
            },
            parser: babelParser,
        },
        rules: {
            'linebreak-style': ['error', 'unix'],
            semi: ['error', 'always'],
            'no-multiple-empty-lines': ['error', {max: 1}],
        }
    }
);

