import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Composition' }).click();
});

test('blocks submission and surfaces native validation messages on empty required fields', async ({ page }) => {
    const nameInput = page.getByPlaceholder('John Doe');
    const nameHint = page.locator('form p.value').first();

    await expect(nameHint).toHaveText('Your full name, as it should appear.');

    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(nameInput).toBeFocused();
    await expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    await expect(nameHint).not.toHaveText('Your full name, as it should appear.');
});

test('clears the validation message once the field is fixed', async ({ page }) => {
    const nameInput = page.getByPlaceholder('John Doe');
    const nameHint = page.locator('form p.value').first();

    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(nameInput).toHaveAttribute('aria-invalid', 'true');

    await nameInput.fill('Ada Lovelace');

    await expect(nameInput).not.toHaveAttribute('aria-invalid', 'true');
    await expect(nameHint).toHaveText('Your full name, as it should appear.');
});

test('applies a custom class via CField scoped slot when the email field is invalid', async ({ page }) => {
    const emailInput = page.getByPlaceholder('john@example.com');

    await expect(emailInput).not.toHaveClass(/is-invalid/);

    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(emailInput).toHaveClass(/is-invalid/);

    await emailInput.fill('ada@example.com');

    await expect(emailInput).not.toHaveClass(/is-invalid/);
});

test('submits and emits the form payload once every required field is valid', async ({ page }) => {
    await page.getByPlaceholder('John Doe').fill('Ada Lovelace');
    await page.getByPlaceholder('john@example.com').fill('ada@example.com');
    await page.getByLabel('I accept the terms').check();

    await page.getByRole('button', { name: 'Submit' }).click();

    const output = page.locator('pre.output');

    await expect(output).toBeVisible();
    await expect(output).toContainText('"name": "Ada Lovelace"');
    await expect(output).toContainText('"terms": true');
});
