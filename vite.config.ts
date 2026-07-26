import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        vue(),
        dts({
            insertTypesEntry: true,
            cleanVueFileName: true,
            compilerOptions: {
                rootDir: resolve(import.meta.dirname, 'src')
            },
            exclude: [
                'src/components/__tests__/**'
            ]
        })
    ],
    build: {
        lib: {
            entry: resolve(import.meta.dirname, 'src/index.ts'),
            formats: [
                'es'
            ],
            // Without this, lib mode names the bundle after the package
            // (@charpente-ui/vue -> vue.js) and package.json's paths break.
            fileName: 'index'
        },
        rollupOptions: {
            external: [
                'vue'
            ]
        }
    }
});
