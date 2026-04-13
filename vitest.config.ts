import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    test: {
        watch: false,
        environment: 'jsdom',
        reporters: [
            'default',
            'junit'
        ],
        outputFile: {
            junit: 'junit.xml'
        },
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
            thresholds: {
                lines: 90,
                functions: 90,
                branches: 90,
                statements: 90
            }
        }
    }
});
