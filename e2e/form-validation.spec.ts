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

test('a formnovalidate submitter goes through with the form still invalid', async ({ page }) => {
    const nameInput = page.getByPlaceholder('John Doe');

    await page.getByRole('button', { name: 'Save draft' }).click();

    const output = page.locator('pre.output');

    await expect(output).toBeVisible();
    await expect(output).toContainText('"draft": true');
    await expect(output).toContainText('"name": ""');
    await expect(nameInput).not.toHaveAttribute('aria-invalid', 'true');
});

test('the plain submit button stays blocked while the draft one is not', async ({ page }) => {
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.locator('pre.output')).toBeHidden();
    await expect(page.getByPlaceholder('John Doe')).toHaveAttribute('aria-invalid', 'true');
});

test('resetting the form clears the validation messages', async ({ page }) => {
    const nameInput = page.getByPlaceholder('John Doe');
    const nameHint = page.locator('form p.value').first();

    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    await expect(nameHint).not.toHaveText('Your full name, as it should appear.');

    await page.getByRole('button', { name: 'Reset' }).click();

    await expect(nameInput).not.toHaveAttribute('aria-invalid', 'true');
    await expect(nameHint).toHaveText('Your full name, as it should appear.');
});

test('applies a custom class directly on CField via a template ref when the name field is invalid', async ({ page }) => {
    const nameField = page.locator('.field').filter({ has: page.getByPlaceholder('John Doe') });

    await expect(nameField).not.toHaveClass(/is-invalid/);

    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(nameField).toHaveClass(/is-invalid/);

    await page.getByPlaceholder('John Doe').fill('Ada Lovelace');

    await expect(nameField).not.toHaveClass(/is-invalid/);
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

test('a rule blocks submission and shows its message like a native error', async ({ page }) => {
    const confirmInput = page.getByPlaceholder('Repeat it');
    const confirmHint = page.locator('form p.value').nth(4);

    await page.getByPlaceholder('John Doe').fill('Ada Lovelace');
    await page.getByPlaceholder('john@example.com').fill('ada@example.com');
    await page.getByLabel('I accept the terms').check();
    await page.getByPlaceholder('Choose a password').fill('correct-horse');
    await confirmInput.fill('typo');

    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.locator('pre.output')).toBeHidden();
    await expect(confirmInput).toBeFocused();
    await expect(confirmInput).toHaveAttribute('aria-invalid', 'true');
    await expect(confirmHint).toHaveText('Both passwords must match.');
});

test('a rule clears as soon as the value satisfies it', async ({ page }) => {
    const confirmInput = page.getByPlaceholder('Repeat it');
    const confirmHint = page.locator('form p.value').nth(4);

    await page.getByPlaceholder('Choose a password').fill('correct-horse');
    await confirmInput.fill('typo');
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(confirmInput).toHaveAttribute('aria-invalid', 'true');

    await confirmInput.fill('correct-horse');

    await expect(confirmInput).not.toHaveAttribute('aria-invalid', 'true');
    await expect(confirmHint).toHaveText('Must match the password above.');
});

// The rule lives on the confirmation field but reads the password one, so
// editing the password alone has to re-run it. Asserted through submission
// rather than through aria-invalid: a field only carries that between a
// rejection and its fix, whatever made it invalid.
test('editing the field a rule reads re-checks the field that carries it', async ({ page }) => {
    const passwordInput = page.getByPlaceholder('Choose a password');
    const confirmInput = page.getByPlaceholder('Repeat it');
    const output = page.locator('pre.output');

    await page.getByPlaceholder('John Doe').fill('Ada Lovelace');
    await page.getByPlaceholder('john@example.com').fill('ada@example.com');
    await page.getByLabel('I accept the terms').check();
    await passwordInput.fill('correct-horse');
    await confirmInput.fill('correct-horse');

    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(output).toBeVisible();

    // Nothing touches the confirmation field from here on.
    await passwordInput.fill('correct-horse-battery');

    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(confirmInput).toBeFocused();
    await expect(confirmInput).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('form p.value').nth(4)).toHaveText('Both passwords must match.');
});

// The name field is both `required` and carries a rule. While the native
// constraint fails, the browser's own message must survive — asserted through
// ValidityState rather than through the text, which is localized and therefore
// depends on the browser's language.
test('a native constraint keeps its own message while it fails', async ({ page }) => {
    const nameInput = page.getByPlaceholder('John Doe');
    const nameHint = page.locator('form p.value').first();

    await page.getByRole('button', { name: 'Submit' }).click();

    const state = await nameInput.evaluate((element: HTMLInputElement) => ({
        valueMissing: element.validity.valueMissing,
        customError: element.validity.customError,
        message: element.validationMessage
    }));

    expect(state.valueMissing).toBe(true);
    expect(state.customError).toBe(false);
    expect(state.message).not.toBe('A name cannot contain digits.');
    expect(state.message.length).toBeGreaterThan(0);
    await expect(nameHint).toHaveText(state.message);
});

test('the rule takes over once the native constraint passes', async ({ page }) => {
    const nameInput = page.getByPlaceholder('John Doe');
    const nameHint = page.locator('form p.value').first();

    await nameInput.fill('Ada 42');
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.locator('pre.output')).toBeHidden();
    await expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    await expect(nameHint).toHaveText('A name cannot contain digits.');

    await nameInput.fill('Ada Lovelace');

    await expect(nameInput).not.toHaveAttribute('aria-invalid', 'true');
    await expect(nameHint).toHaveText('Your full name, as it should appear.');
});

// The library never resets a v-model on its own; the playground's own handler
// does, which is what the guide recommends. This pins the recommended path:
// values and rules come back in step.
test('resetting values alongside the form clears a rule error', async ({ page }) => {
    const confirmInput = page.getByPlaceholder('Repeat it');
    const confirmHint = page.locator('form p.value').nth(4);

    await page.getByPlaceholder('Choose a password').fill('correct-horse');
    await confirmInput.fill('typo');
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(confirmHint).toHaveText('Both passwords must match.');

    await page.getByRole('button', { name: 'Reset' }).click();

    await expect(confirmHint).toHaveText('Must match the password above.');
    await expect(confirmInput).not.toHaveAttribute('aria-invalid', 'true');
    await expect(confirmInput).toHaveValue('');

    // The pair is genuinely valid again, not merely no longer displaying.
    await page.getByPlaceholder('John Doe').fill('Ada Lovelace');
    await page.getByPlaceholder('john@example.com').fill('ada@example.com');
    await page.getByLabel('I accept the terms').check();
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.locator('pre.output')).toBeVisible();
});
