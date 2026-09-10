import FfTheme from '@frontfactory/vitepress-theme';
import type { Theme } from 'vitepress';
import Demo from './Demo.vue';
import './custom.css';

export default {
    extends: FfTheme,
    enhanceApp({ app }) {
        app.component('Demo', Demo);
    }
} satisfies Theme;
