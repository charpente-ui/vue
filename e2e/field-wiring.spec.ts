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

// Whether the click also moves focus is the engine's call — WebKit follows the
// macOS convention and leaves focus where it was on a checkbox. Toggling is what
// the for/id pairing actually buys, and that holds everywhere.
test('clicking the label toggles a linked checkbox', async ({ page }) => {
    const label = page.getByText('Single checkbox', { exact: true });
    const checkbox = page.locator('input[type="checkbox"]').first();

    await label.click();

    await expect(checkbox).toBeChecked();
});

test('aria-describedby links the input to every supporting text of the field', async ({ page }) => {
    await page.getByRole('button', { name: 'Composition' }).click();

    const input = page.getByPlaceholder('Click the label to focus me...');
    const field = page.locator('.field').filter({ has: input });

    const describedBy = await input.getAttribute('aria-describedby');

    // Only identified texts can be referenced: the field also renders plain <p>
    // elements that are not supporting texts. Both tags are listed because the
    // third supporting text below is rendered as a <span>.
    const ids = await field.locator('p[id], span[id]').evaluateAll((texts) => texts.map((text) => text.id));

    expect(ids).toHaveLength(3);
    expect(describedBy).toBe(ids.join(' '));
});

// The tag is the app's to pick, and picking it must not cost the wiring.
test('a supporting text rendered as another tag is still referenced by the control', async ({ page }) => {
    await page.getByRole('button', { name: 'Composition' }).click();

    const input = page.getByLabel('Auto-linked label');
    const span = page.locator('span.value', { hasText: 'rendered as a' });

    const describedBy = await input.getAttribute('aria-describedby');
    const id = await span.getAttribute('id');

    expect(id).toBeTruthy();
    expect(describedBy?.split(' ')).toContain(id);
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
