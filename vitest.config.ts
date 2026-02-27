import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    test: {
        globals: true,
        environment: 'jsdom',
        coverage: {
            provider: 'v8',
            reporter: [
                'text',
                'json',
                'html'
            ],
            include: [
                'src/components/**'
            ],
            exclude: [
                'src/index.ts'
            ],
            thresholds: {
                lines: 90,
                functions: 90,
                branches: 90,
                statements: 90
            }
        }
    }
});
