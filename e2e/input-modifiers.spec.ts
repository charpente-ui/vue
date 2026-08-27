import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test('the number modifier turns a typed value into a real number', async ({ page }) => {
    await page.getByLabel('Number').fill('42');

    await expect(page.getByText('Number:', { exact: false })).toContainText('42 (number)');
});

test('the trim modifier strips the surrounding spaces from the model', async ({ page }) => {
    const input = page.getByLabel('Trimmed');

    await input.fill('  padded  ');

    await expect(page.getByText('Trimmed:', { exact: false })).toContainText('[padded]');

    // The model is trimmed, the field is not — not while the user is still in
    // it. Writing the trimmed value back is what used to eat the space.
    await expect(input).toHaveValue('  padded  ');

    await input.blur();

    await expect(input).toHaveValue('padded');
});

// The regression this guards against: every space typed disappeared under the
// cursor, so a two-word value could not be entered at all.
test('a trimmed field accepts a space in the middle of a word', async ({ page }) => {
    const input = page.getByLabel('Trimmed');

    await input.pressSequentially('Jean Dupont');

    await expect(input).toHaveValue('Jean Dupont');
    await expect(page.getByText('Trimmed:', { exact: false })).toContainText('[Jean Dupont]');
});

test('the lazy modifier holds the model back until the field is left', async ({ page }) => {
    const input = page.getByLabel('Lazy (updates on blur/enter)');
    const value = page.getByText('Lazy:', { exact: false });

    await input.pressSequentially('deferred');

    await expect(value).toHaveText('Lazy:');

    await input.blur();

    await expect(value).toContainText('deferred');
});
