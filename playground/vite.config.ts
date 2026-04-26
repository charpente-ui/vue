import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';
import { resolve } from 'path';

const dir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    root: dir,
    plugins: [vue()],
    resolve: {
        alias: {
            '@charpente-ui/vue': resolve(dir, '../src/index.ts')
        }
    }
});
