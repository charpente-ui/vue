import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test('arrow keys move selection across radios sharing the same name', async ({ page }) => {
    const group = page.locator('fieldset').filter({ has: page.locator('input[type="radio"]') });
    const optionA = group.locator('input[type="radio"]').nth(0);
    const optionB = group.locator('input[type="radio"]').nth(1);

    await optionA.click();
    await expect(optionA).toBeChecked();

    await page.keyboard.press('ArrowDown');

    await expect(optionB).toBeChecked();
    await expect(optionA).not.toBeChecked();
});
