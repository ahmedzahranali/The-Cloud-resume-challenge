const { test, expect } = require('@playwright/test');

// Never increment the production counter during automated tests.
test.beforeEach(async ({ page }) => {
  await page.route('https://uizk0ln0mj.execute-api.us-east-1.amazonaws.com/**', route =>
    route.fulfill({ json: { count: '42' } }));
});

test('critical content and counter load without JavaScript errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page).toHaveTitle(/Ahmed Zahran/);
  await expect(page.getByRole('heading', { name: 'Ahmed Zahran Ali', exact: true })).toBeVisible();
  await expect(page.locator('#counter')).toHaveText('42');
  await expect(page.locator('#motion-toggle')).toBeVisible();
  await expect(page.locator('#print-btn')).toBeVisible();
  expect(errors).toEqual([]);
});

test('motion preference persists across reloads', async ({ page }) => {
  await page.goto('/');
  const toggle = page.locator('#motion-toggle');
  const wasPaused = await toggle.getAttribute('aria-pressed');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', String(wasPaused !== 'true'));
  await page.reload();
  await expect(toggle).toHaveAttribute('aria-pressed', String(wasPaused !== 'true'));
});

test('counter handles an unavailable API', async ({ page }) => {
  await page.route('https://uizk0ln0mj.execute-api.us-east-1.amazonaws.com/**', route =>
    route.fulfill({ status: 503, body: 'Unavailable' }));
  await page.goto('/');
  await expect(page.locator('#counter')).toHaveText('offline');
});

test('layout fits the viewport and print reveals all sections', async ({ page }) => {
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.topbar')).toBeHidden();
  for (const id of ['summary', 'skills', 'certifications', 'experience', 'projects', 'education']) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
});

test('print button invokes the browser print action', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => { window.print = () => { window.printRequested = true; }; });
  await page.locator('#print-btn').click();
  expect(await page.evaluate(() => window.printRequested)).toBe(true);
});
