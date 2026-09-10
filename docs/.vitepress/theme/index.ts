import FfTheme from '@frontfactory/vitepress-theme';
import type { Theme } from 'vitepress';
import Demo from './Demo.vue';
import Layout from './Layout.vue';
import './custom.css';

export default {
    extends: FfTheme,
    Layout,
    enhanceApp({ app }) {
        app.component('Demo', Demo);
    }
} satisfies Theme;
