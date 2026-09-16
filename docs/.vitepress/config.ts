import { defineConfigWithTheme } from 'vitepress';
import baseConfig from '@frontfactory/vitepress-theme/config';
import type { ThemeConfig } from '@frontfactory/vitepress-theme';
import { fileURLToPath, URL } from 'node:url';
import { createRequire } from 'node:module';

const { version } = createRequire(import.meta.url)('../../package.json');

// Baked in at build time. The range stays a single year until the project
// outlives its first one.
const startYear = 2026;
const thisYear = new Date().getFullYear();
const years = thisYear > startYear ? `${startYear}–${thisYear}` : `${startYear}`;

// Served at the root of https://charpente.frontfactory.dev (Vercel).
// Moving back to a GitHub project page? Set base to '/vue/'.
const base = '/';
const hostname = 'https://charpente.frontfactory.dev';

const title = 'Charpente UI';
const description = 'Headless Vue 3 components. The logic you need, without the CSS you don\'t.';

export default defineConfigWithTheme<ThemeConfig>({
    // Required by the theme: swaps the default-theme components it replaces,
    // keeps the package out of dependency pre-bundling and injects the banner
    // script.
    extends: baseConfig,
    base,
    title,
    description,
    cleanUrls: true,
    sitemap: { hostname },
    // Underscore-prefixed files are partials pulled in with <!--@include: -->,
    // never pages of their own.
    srcExclude: [
        '**/_*.md'
    ],
    lastUpdated: true,
    titleTemplate: ':title | Charpente UI',
    // og:title, og:description, og:url and the canonical link are per-page:
    // see transformPageData below. Only site-wide tags belong here.
    head: [
        [
            'link',
            { rel: 'icon',
                type: 'image/svg+xml',
                href: `${base}favicon.svg` }
        ],
        [
            'meta',
            { name: 'theme-color',
                content: '#b84277' }
        ],
        [
            'meta',
            { property: 'og:type',
                content: 'website' }
        ],
        [
            'meta',
            { property: 'og:site_name',
                content: title }
        ],
        // PNG, not SVG: no social network renders an SVG preview.
        [
            'meta',
            { property: 'og:image',
                content: `${hostname}/banner.png` }
        ],
        [
            'meta',
            { property: 'og:image:width',
                content: '1200' }
        ],
        [
            'meta',
            { property: 'og:image:height',
                content: '630' }
        ],
        [
            'meta',
            { property: 'og:image:alt',
                content: 'Charpente UI — headless component library for Vue 3' }
        ],
        [
            'meta',
            { name: 'twitter:card',
                content: 'summary_large_image' }
        ],
        [
            'meta',
            { name: 'twitter:image',
                content: `${hostname}/banner.png` }
        ]
    ],
    transformPageData(pageData) {
        const path = pageData.relativePath
            .replace(/(^|\/)index\.md$/, '$1')
            .replace(/\.md$/, '');
        const url = `${hostname}/${path}`;
        // Mirrors titleTemplate: the home page keeps the bare site title.
        const pageTitle = pageData.title && pageData.title !== title
            ? `${pageData.title} | ${title}`
            : title;

        pageData.frontmatter.head ??= [];
        pageData.frontmatter.head.push(
            [
                'link',
                { rel: 'canonical',
                    href: url }
            ],
            [
                'meta',
                { property: 'og:url',
                    content: url }
            ],
            [
                'meta',
                { property: 'og:title',
                    content: pageTitle }
            ],
            [
                'meta',
                { property: 'og:description',
                    content: pageData.description || description }
            ]
        );
    },
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
                    { text: 'Comparison',
                        link: '/guide/comparison' },
                    { text: 'Accessibility',
                        link: '/guide/accessibility' },
                    { text: 'Changelog',
                        link: '/guide/changelog' }
                ]
            },
            {
                text: 'Guides',
                items: [
                    { text: 'Ids',
                        link: '/guide/ids' },
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
        ff: {
            navOrder: 'menu-first',
            footerColumns: [
                {
                    title: 'Guide',
                    items: [
                        { text: 'Getting started',
                            link: '/guide/getting-started' },
                        { text: 'Components',
                            link: '/components/' },
                        { text: 'Accessibility',
                            link: '/guide/accessibility' },
                        { text: 'Changelog',
                            link: '/guide/changelog' }
                    ]
                },
                {
                    title: 'Project',
                    items: [
                        // The repo link itself now lives in the native footerSocial column below.
                        { text: 'Releases',
                            link: 'https://github.com/charpente-ui/vue/releases' },
                        { text: 'Issues',
                            link: 'https://github.com/charpente-ui/vue/issues' },
                        { text: 'npm',
                            link: 'https://www.npmjs.com/package/@charpente-ui/vue' }
                    ]
                }
            ]
        },
        footer: {
            message: 'Released under the MIT License.',
            copyright: `Copyright © ${years} <a href="https://frontfactory.dev">Front Factory</a>.`
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
