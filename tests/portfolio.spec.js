const { test, expect } = require('@playwright/test');
const path = require('path');

test('Portfolio Quality Gate: Critical UI Elements Load', async ({ page }) => {
    // We go UP one level from tests/ and then DOWN into frontend/
    const filePath = 'file://' + path.resolve(__dirname, '../frontend/index.html');
    
    await page.goto(filePath);

    // Assertions
    await expect(page).toHaveTitle(/Ahmed Zahran/);
    
    // Check for the actual buttons in your top bar instead of theme-toggle
    await expect(page.locator('#motion-toggle')).toBeVisible();
    await expect(page.locator('#print-btn')).toBeVisible();
    
    await expect(page.locator('#counter')).toBeVisible();
});
