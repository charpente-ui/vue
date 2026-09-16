import { configDefaults, defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [
        vue()
    ],
    test: {
        watch: false,
        environment: 'jsdom',
        exclude: [
            ...configDefaults.exclude,
            'e2e/**'
        ],
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
            // Set to what the suite actually covers, not to a round number
            // below it: a threshold under the real figure protects nothing —
            // it silently allows every point of regression in between.
            //
            // Branches sit at 99.39% (165/166). The one uncovered branch is
            // the `index !== -1` miss in BaseField's unregisterSupportingText,
            // unreachable while every supporting text registers before it
            // unregisters. Losing a second branch drops below 99 and fails.
            thresholds: {
                lines: 100,
                functions: 100,
                branches: 99,
                statements: 100
            }
        }
    }
});
