module.exports = {
    env: { browser: true, es6: true, node: true },
    extends: ['eslint:recommended'],
    globals: { Atomics: 'readonly', SharedArrayBuffer: 'readonly' },
    parser: '@babel/eslint-parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    rules: {
        'linebreak-style': ['error', 'unix'],

        semi: ['error', 'always'],
        'no-multiple-empty-lines': ['error', { max: 1 }],
        '@typescript-eslint/ban-types': [
            'error',
            {
                extendDefaults: true,
                types: {
                    '{}': false,
                },
            },
        ],
    },
    overrides: [
        {
            files: ['**/*.ts', '**/*.tsx'],
            env: { browser: true, es6: true, node: true },
            extends: [
                'eslint:recommended',
                'plugin:@typescript-eslint/eslint-recommended',
                'plugin:@typescript-eslint/recommended',
                'prettier',
            ],
            globals: { Atomics: 'readonly', SharedArrayBuffer: 'readonly' },
            parser: '@typescript-eslint/parser',
            parserOptions: {
                ecmaVersion: 2018,
                sourceType: 'module',
                project: ['./tsconfig.json', './tsconfig.e2e.json'],
            },
            plugins: ['@typescript-eslint'],
            rules: {
                '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
                'linebreak-style': ['error', 'unix'],
                '@typescript-eslint/no-var-requires': 0,
                '@typescript-eslint/no-explicit-any': 0,
            },
        },
    ],
};
