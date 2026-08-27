import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

// A native button submits by default, which is the accident CButton exists to
// avoid. Only a real browser proves the attribute reaches the element.
test('CButton renders a native button that defaults to type="button"', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Button',
        exact: true });

    await expect(button).toHaveAttribute('type', 'button');
});

test('CButton as="a" renders a real link, without the button type', async ({ page }) => {
    const link = page.getByRole('link', { name: 'As link' });

    await expect(link).toHaveAttribute('href', '#');
    await expect(link).not.toHaveAttribute('type', /.*/);
});
