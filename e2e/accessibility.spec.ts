import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

// The library ships no CSS, so anything a stylesheet decides is out of its
// reach by construction: contrast is the playground's own palette, and a
// scrollable code block is the playground's own layout. Both fire on the
// chrome around the components, never on the markup Charpente renders — see
// the Accessibility guide, "Colour and contrast. Entirely yours."
//
// What is left is exactly what the library is responsible for: element roles,
// names, and the ARIA wiring between a label, a control and its hints.
const scan = (page: Page) => {
    return new AxeBuilder({ page })
        .withTags(['wcag2a',
            'wcag2aa',
            'wcag21a',
            'wcag21aa'])
        .disableRules(['color-contrast',
            'scrollable-region-focusable'])
        .analyze();
};

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test('the primitives have no accessibility violation', async ({ page }) => {
    const { violations } = await scan(page);

    expect(violations).toEqual([]);
});

test('the compositions have no accessibility violation', async ({ page }) => {
    await page.getByRole('button', { name: 'Composition' }).click();

    const { violations } = await scan(page);

    expect(violations).toEqual([]);
});

// The state worth scanning most: this is where the library adds aria-invalid,
// swaps the hint for a validation message and turns it into a role="alert"
// live region. A violation here would mean the error is announced wrong — the
// one thing the wiring exists to get right.
test('a rejected form has no accessibility violation', async ({ page }) => {
    await page.getByRole('button', { name: 'Composition' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.locator('[aria-invalid="true"]').first()).toBeVisible();

    const { violations } = await scan(page);

    expect(violations).toEqual([]);
});
