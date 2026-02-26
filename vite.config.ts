import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        vue(),
        dts({
            insertTypesEntry: true,
            cleanVueFileName: true
        })
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'Charpente',
            fileName: 'charpente'
        },
        rollupOptions: {
            external: [
                'vue'
            ],
            output: {
                globals: {
                    vue: 'Vue'
                }
            }
        }
    }
});
