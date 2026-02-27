// ============================================================================================= //
//                                            ESLINT                                             //
// ============================================================================================= //

import { defineConfig } from 'eslint/config';
import frontFactoryConfig from '@front-factory/eslint-config';
import ts from 'typescript-eslint';
import vuePlugin from 'eslint-plugin-vue';

export default defineConfig([
    {
        ignores: [
            'dist/**',
            'node_modules/**'
        ]
    },
    ...ts.configs.recommended,
    ...vuePlugin.configs['flat/recommended'],
    ...frontFactoryConfig,
    {
        files: [
            '**/*.vue'
        ],
        languageOptions: {
            parser: vuePlugin.parser,
            parserOptions: {
                parser: ts.parser,
                sourceType: 'module',
                extraFileExtensions: ['.vue']
            }
        }
    },
    {
        plugins: {
            'vue': vuePlugin
        },
        rules: {
            '@stylistic/object-curly-newline': [
                'error',
                {
                    'ImportDeclaration': 'never'
                }
            ],
            'vue/first-attribute-linebreak': [
                'error',
                {
                    'singleline': 'ignore',
                    'multiline': 'beside'
                }
            ],
            'vue/html-closing-bracket-newline': [
                'error',
                {
                    'singleline': 'never',
                    'multiline': 'never'
                }
            ],
            'vue/html-closing-bracket-spacing': [
                'error',
                {
                    'selfClosingTag': 'never'
                }
            ],
            'vue/html-indent': [
                'error',
                4
            ],
            'vue/html-self-closing': [
                'error',
                {
                    'html': {
                        'void': 'always',
                        'normal': 'always',
                        'component': 'always'
                    },
                    'svg': 'always',
                    'math': 'always'
                }
            ],
            'vue/max-attributes-per-line': 'off',
            'vue/multi-word-component-names': 'off',
            'vue/singleline-html-element-content-newline': 'off'
        }
    }
]);
