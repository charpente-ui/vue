import { test, expect } from '@playwright/test';
import { writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test('CSelect multiple lets several options be selected at once', async ({ page }) => {
    const select = page.getByLabel('Pick several');

    await select.selectOption(['a',
        'c']);

    const value = page.getByText('Multiple:', { exact: false });

    await expect(value).toContainText('"a"');
    await expect(value).toContainText('"c"');
    await expect(value).not.toContainText('"b"');
});

test('CSelect keeps a numeric option value a number through a real select', async ({ page }) => {
    const select = page.getByLabel('Pick from a group');

    await select.selectOption({ label: 'Strawberry' });

    await expect(page.getByText('Grouped:', { exact: false })).toContainText('1 (number)');
});

test('CSelect renders the options prop as optgroups, slot content first', async ({ page }) => {
    const select = page.getByLabel('Pick from a group');

    // An optgroup is named by its `label` attribute, not by its text content.
    const labels = await select.locator('optgroup').evaluateAll((groups) => {
        return groups.map((group) => (group as HTMLOptGroupElement).label);
    });

    expect(labels).toEqual(['Citrus',
        'Berries',
        'Unavailable']);

    // The slot placeholder must come before anything the options prop renders.
    await expect(select.locator('> *').first()).toHaveText('--');

    // A disabled group disables its options natively.
    const durian = select.locator('optgroup[label="Unavailable"] option');

    await expect(durian).toBeDisabled();
});

test('CSelect combines the slot placeholder with a flat options list', async ({ page }) => {
    const select = page.getByLabel('Pick a fruit');

    await expect(select.locator('option')).toHaveText(['Choose a fruit…',
        'apple',
        'Banana',
        'Cherry (out of stock)']);
    await expect(select.locator('option', { hasText: 'Cherry' })).toBeDisabled();

    await select.selectOption('banana');

    await expect(page.getByText('Flat:', { exact: false })).toContainText('banana');
});

test('CFile reports the uploaded file name after selection', async ({ page }) => {
    const filePath = join(tmpdir(), 'charpente-e2e-upload.txt');

    writeFileSync(filePath, 'hello');

    const fileInput = page.getByLabel('Upload');

    await fileInput.setInputFiles(filePath);

    await expect(page.getByText('File:', { exact: false })).toContainText('charpente-e2e-upload.txt');
});
