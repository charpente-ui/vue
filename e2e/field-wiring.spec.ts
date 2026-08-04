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

    // Only identified paragraphs can be referenced: the field also renders plain
    // <p> elements that are not supporting texts.
    const ids = await field.locator('p[id]').evaluateAll((texts) => texts.map((text) => text.id));

    expect(ids).toHaveLength(2);
    expect(describedBy).toBe(ids.join(' '));
});

test('wires a native control through the scoped slot id and describedBy', async ({ page }) => {
    await page.getByRole('button', { name: 'Composition' }).click();

    const label = page.getByText('Birthdate — native input, wired by hand');
    const input = page.locator('input[type="date"]');

    await label.click();

    await expect(input).toBeFocused();

    const field = page.locator('.field').filter({ has: input });
    const describedBy = await input.getAttribute('aria-describedby');

    await expect(field.locator(`#${describedBy}`)).toHaveText(/Not a Charpente component/);
});

test('flags a native control as invalid through the scoped slot', async ({ page }) => {
    await page.getByRole('button', { name: 'Composition' }).click();

    const input = page.locator('input[type="date"]');
    const message = page.locator(`#${await input.getAttribute('aria-describedby')}`);

    await expect(input).not.toHaveAttribute('aria-invalid', 'true');
    await expect(message).toHaveText(/Not a Charpente component/);

    await page.getByRole('button', { name: 'Validate the date' }).click();

    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(message).not.toHaveText(/Not a Charpente component/);
});
