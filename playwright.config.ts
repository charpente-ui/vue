import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: 'list',
    use: {
        baseURL: 'http://localhost:5183',
        trace: 'retain-on-failure'
    },
    // The library delegates to the browser's own constraint validation, so the
    // engines are the implementation: message wording, the order the invalid
    // events fire in and what `setCustomValidity` does to `validity.valid` are
    // all engine territory. Testing one of them would only prove Chromium works.
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] }
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] }
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] }
        }
    ],
    webServer: {
        command: 'npm run dev -- --port 5183 --strictPort',
        url: 'http://localhost:5183',
        reuseExistingServer: !process.env.CI
    }
});
