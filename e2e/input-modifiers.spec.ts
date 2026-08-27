import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test('the number modifier turns a typed value into a real number', async ({ page }) => {
    await page.getByLabel('Number').fill('42');

    await expect(page.getByText('Number:', { exact: false })).toContainText('42 (number)');
});

test('the trim modifier strips the surrounding spaces from the model', async ({ page }) => {
    await page.getByLabel('Trimmed').fill('  padded  ');

    await expect(page.getByText('Trimmed:', { exact: false })).toContainText('[padded]');
});

test('the lazy modifier holds the model back until the field is left', async ({ page }) => {
    const input = page.getByLabel('Lazy (updates on blur/enter)');
    const value = page.getByText('Lazy:', { exact: false });

    await input.pressSequentially('deferred');

    await expect(value).toHaveText('Lazy:');

    await input.blur();

    await expect(value).toContainText('deferred');
});
