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

test('aria-describedby links the input to its supporting text', async ({ page }) => {
    await page.getByRole('button', { name: 'Composition' }).click();

    const input = page.getByPlaceholder('Click the label to focus me...');
    const supportingText = page.getByText('Supporting text — wired to the input via', { exact: false });

    const describedBy = await input.getAttribute('aria-describedby');
    const textId = await supportingText.getAttribute('id');

    expect(describedBy).toBeTruthy();
    expect(describedBy).toBe(textId);
});
