import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test('the legend gives the fieldset its accessible name', async ({ page }) => {
    const group = page.locator('fieldset').filter({ has: page.locator('input[type="radio"]') }).first();

    await expect(group).toHaveAccessibleName('Options');
});

test('arrow keys move selection across radios sharing the same name', async ({ page }) => {
    const group = page.locator('fieldset').filter({ has: page.locator('input[type="radio"]') }).first();
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

// A group needs no CField around it: the fieldset owns the description and the
// invalid state, wired from the supporting text written inside it.
for (const kind of [
    {
        name: 'radio',
        group: '.self-radio',
        submit: 'Validate the plan',
        reset: 'Clear the plan',
        hint: 'Change it whenever you want.',
        fix: 'Free'
    },
    {
        name: 'checkbox',
        group: '.self-checkbox',
        submit: 'Validate the tags',
        reset: 'Clear the tags',
        hint: 'Choose the tags that apply.',
        fix: 'Alpha'
    }
]) {
    test.describe(`a standalone ${kind.name} group`, () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/');
            await page.getByRole('button', { name: 'Composition' }).click();
        });

        test('is flagged and shows the browser message on a rejected submit, then clears on fix', async ({ page }) => {
            const group = page.locator(kind.group);
            const text = group.locator('p');

            await expect(group).not.toHaveAttribute('aria-invalid', 'true');
            await expect(text).toHaveText(kind.hint);

            await page.getByRole('button', { name: kind.submit }).click();

            await expect(group).toHaveAttribute('aria-invalid', 'true');
            await expect(group).toHaveAttribute('aria-describedby', (await text.getAttribute('id')) as string);
            await expect(text).not.toHaveText(kind.hint);

            await group.getByText(kind.fix, { exact: true }).click();

            await expect(group).not.toHaveAttribute('aria-invalid', 'true');
            await expect(text).toHaveText(kind.hint);
        });

        test('is cleared when the form is reset', async ({ page }) => {
            const group = page.locator(kind.group);

            await page.getByRole('button', { name: kind.submit }).click();
            await expect(group).toHaveAttribute('aria-invalid', 'true');

            await page.getByRole('button', { name: kind.reset }).click();

            await expect(group).not.toHaveAttribute('aria-invalid', 'true');
            await expect(group.locator('p')).toHaveText(kind.hint);
        });
    });
}

test('the legend prop names a radio group', async ({ page }) => {
    await page.getByRole('button', { name: 'Composition' }).click();
    await expect(page.getByRole('group', { name: 'Plan' })).toBeVisible();
    await expect(page.getByRole('group', { name: 'Plan' }).getByRole('radio').first()).toBeVisible();
});

test('the legend prop names a checkbox group', async ({ page }) => {
    await page.getByRole('button', { name: 'Composition' }).click();
    await expect(page.getByRole('group', { name: 'Tags' })).toBeVisible();
    await expect(page.getByRole('group', { name: 'Tags' }).getByRole('checkbox').first()).toBeVisible();
});
