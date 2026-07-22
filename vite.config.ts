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
            exclude: [
                'src/components/__tests__/**'
            ]
        })
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            formats: [
                'es'
            ]
        },
        rollupOptions: {
            external: [
                'vue'
            ],
            output: {
                preserveModules: true,
                preserveModulesRoot: 'src',
                entryFileNames: (chunk) => {
                    return `${chunk.name.split('?')[0].replace(/\.vue$/, '')}.js`;
                }
            }
        }
    }
});
