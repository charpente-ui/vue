import { test, expect } from '@playwright/test';

// The playground runs in development, where the warnings are live, and uses
// every group the way the docs do. None of it may trip one: a warning that
// fires on correct markup teaches apps to ignore the ones that matter.
test('the playground trips no development warning', async ({ page }) => {
    const warnings: string[] = [];

    page.on('console', (message) => {
        if (message.text().startsWith('[Charpente]')) {
            warnings.push(message.text());
        }
    });

    await page.goto('/');
    await page.getByRole('button', { name: 'Composition' }).click();
    await expect(page.getByRole('heading', { name: 'CForm — native validation' })).toBeVisible();

    expect(warnings).toEqual([]);
});
