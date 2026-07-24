import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test('clicking the label focuses the linked input', async ({ page }) => {
    const label = page.getByText('Text', { exact: true });
    const input = page.getByPlaceholder('Type something...').first();

    await label.click();

    await expect(input).toBeFocused();
});

test('clicking the label focuses a linked checkbox', async ({ page }) => {
    const label = page.getByText('Single checkbox', { exact: true });
    const checkbox = page.locator('input[type="checkbox"]').first();

    await label.click();

    await expect(checkbox).toBeFocused();
    await expect(checkbox).toBeChecked();
});

test('aria-describedby links the input to every supporting text of the field', async ({ page }) => {
    await page.getByRole('button', { name: 'Composition' }).click();

    const input = page.getByPlaceholder('Click the label to focus me...');
    const field = page.locator('.field').filter({ has: input });

    const describedBy = await input.getAttribute('aria-describedby');
    const ids = await field.locator('p').evaluateAll((texts) => texts.map((text) => text.id));

    expect(ids).toHaveLength(2);
    expect(ids.every(Boolean)).toBe(true);
    expect(describedBy).toBe(ids.join(' '));
});
