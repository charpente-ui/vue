import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test('reflects partial selection as the DOM indeterminate property', async ({ page }) => {
    const card = page.locator('section.card', { has: page.getByText('CCheckbox — indeterminate') });
    const selectAll = card.locator('input[type="checkbox"]').first();
    const apple = card.getByRole('checkbox', { name: 'apple' });

    await expect(selectAll).not.toBeChecked();
    expect(await selectAll.evaluate((el: HTMLInputElement) => el.indeterminate)).toBe(false);

    await apple.check();

    expect(await selectAll.evaluate((el: HTMLInputElement) => el.indeterminate)).toBe(true);
    await expect(selectAll).not.toBeChecked();

    await card.getByRole('checkbox', { name: 'banana' }).check();
    await card.getByRole('checkbox', { name: 'cherry' }).check();

    expect(await selectAll.evaluate((el: HTMLInputElement) => el.indeterminate)).toBe(false);
    await expect(selectAll).toBeChecked();
});

test('the select-all checkbox checks every item in the sub-group', async ({ page }) => {
    const card = page.locator('section.card', { has: page.getByText('CCheckbox — indeterminate') });
    const selectAll = card.locator('input[type="checkbox"]').first();

    await selectAll.check();

    for (const name of ['apple',
        'banana',
        'cherry']) {
        await expect(card.getByRole('checkbox', { name })).toBeChecked();
    }

    expect(await selectAll.evaluate((el: HTMLInputElement) => el.indeterminate)).toBe(false);
});
