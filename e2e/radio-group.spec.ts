import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test('the legend gives the fieldset its accessible name', async ({ page }) => {
    const group = page.locator('fieldset').filter({ has: page.locator('input[type="radio"]') });

    await expect(group).toHaveAccessibleName('Options');
});

test('arrow keys move selection across radios sharing the same name', async ({ page }) => {
    const group = page.locator('fieldset').filter({ has: page.locator('input[type="radio"]') });
    const optionA = group.locator('input[type="radio"]').nth(0);
    const optionB = group.locator('input[type="radio"]').nth(1);

    await optionA.check();
    await expect(optionA).toBeChecked();

    // Focused explicitly rather than through the click above: WebKit does not
    // move focus to a radio that was clicked, and the subject here is the arrow
    // navigation a shared name enables, not the engine's click-focus policy.
    await optionA.focus();
    await page.keyboard.press('ArrowDown');

    await expect(optionB).toBeChecked();
    await expect(optionA).not.toBeChecked();
});
