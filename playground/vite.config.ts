import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
    root: import.meta.dirname,
    plugins: [vue()],
    resolve: {
        alias: {
            '@charpente-ui/vue': resolve(import.meta.dirname, '../src/index.ts')
        }
    }
});
