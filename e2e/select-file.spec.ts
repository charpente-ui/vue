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

test('CFile reports the uploaded file name after selection', async ({ page }) => {
    const filePath = join(tmpdir(), 'charpente-e2e-upload.txt');

    writeFileSync(filePath, 'hello');

    const fileInput = page.getByLabel('Upload');

    await fileInput.setInputFiles(filePath);

    await expect(page.getByText('File:', { exact: false })).toContainText('charpente-e2e-upload.txt');
});
