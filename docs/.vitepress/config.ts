import { defineConfig } from 'vitepress';
import { fileURLToPath, URL } from 'node:url';
import { createRequire } from 'node:module';

const { version } = createRequire(import.meta.url)('../../package.json');

// GitHub project page: https://charpente-ui.github.io/vue/
// Serving from a custom domain instead? Set base to '/'.
const base = '/vue/';

export default defineConfig({
    base,
    title: 'Charpente UI',
    description: 'Headless Vue 3 components. The logic you need, without the CSS you don\'t.',
    cleanUrls: true,
    // Underscore-prefixed files are partials pulled in with <!--@include: -->,
    // never pages of their own.
    srcExclude: ['**/_*.md'],
    lastUpdated: true,
    titleTemplate: ':title | Charpente UI',
    head: [
        ['link',
            { rel: 'icon',
                type: 'image/svg+xml',
                href: `${base}favicon.svg` }],
        ['meta',
            { name: 'theme-color',
                content: '#b84277' }],
        ['meta',
            { property: 'og:type',
                content: 'website' }],
        ['meta',
            { property: 'og:title',
                content: 'Charpente UI' }],
        ['meta',
            { property: 'og:image',
                content: 'https://charpente-ui.github.io/vue/banner.svg' }],
        ['meta',
            { property: 'og:description',
                content: 'Headless Vue 3 components. The logic you need, without the CSS you don\'t.' }]
    ],
    themeConfig: {
        // Decorative: the mark sits inside the same link as the site title, so
        // an alt would make a screen reader announce the name twice.
        logo: { light: '/logo-light.svg',
            dark: '/logo-dark.svg',
            alt: '' },
        search: { provider: 'local' },
        nav: [
            { text: 'Guide',
                link: '/guide/getting-started',
                activeMatch: '/guide/' },
            { text: 'Components',
                link: '/components/',
                activeMatch: '/components/' },
            {
                text: `v${version}`,
                items: [
                    { text: 'Changelog',
                        link: '/guide/changelog' },
                    { text: 'Releases',
                        link: 'https://github.com/charpente-ui/vue/releases' },
                    { text: 'npm',
                        link: 'https://www.npmjs.com/package/@charpente-ui/vue' }
                ]
            }
        ],
        sidebar: [
            {
                text: 'Overview',
                items: [
                    { text: 'Introduction',
                        link: '/guide/introduction' },
                    { text: 'Getting started',
                        link: '/guide/getting-started' },
                    { text: 'Accessibility',
                        link: '/guide/accessibility' },
                    { text: 'Changelog',
                        link: '/guide/changelog' }
                ]
            },
            {
                text: 'Guides',
                items: [
                    { text: 'Native validation',
                        link: '/guide/validation' },
                    { text: 'Wrapping components',
                        link: '/guide/wrapping' }
                ]
            },
            {
                text: 'Components',
                items: [
                    { text: 'Overview',
                        link: '/components/' },
                    { text: 'Button',
                        link: '/components/button' },
                    { text: 'Checkbox',
                        link: '/components/checkbox' },
                    { text: 'Field',
                        link: '/components/field' },
                    { text: 'File',
                        link: '/components/file' },
                    { text: 'Form',
                        link: '/components/form' },
                    { text: 'Input',
                        link: '/components/input' },
                    { text: 'Label',
                        link: '/components/label' },
                    { text: 'Radio',
                        link: '/components/radio' },
                    { text: 'Select',
                        link: '/components/select' },
                    { text: 'SupportingText',
                        link: '/components/supporting-text' },
                    { text: 'Textarea',
                        link: '/components/textarea' }
                ]
            }
        ],
        socialLinks: [
            { icon: 'github',
                link: 'https://github.com/charpente-ui/vue' }
        ],
        editLink: {
            pattern: 'https://github.com/charpente-ui/vue/edit/main/docs/:path',
            text: 'Edit this page on GitHub'
        },
        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © Charpente UI'
        }
    },
    vite: {
        resolve: {
            alias: {
                // Docs run against the source, so every demo is the real component.
                '@charpente-ui/vue': fileURLToPath(new URL('../../src/index.ts', import.meta.url))
            }
        }
    }
});
