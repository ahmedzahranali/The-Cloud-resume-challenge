// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  use: {
    /* Capture screenshot after each test failure. */
    screenshot: 'only-on-failure',
    /* You can also record video on failure for deeper debugging */
    video: 'retain-on-failure',
  },
  /* Reporter to use. 'html' generates a nice folder with all results */
  reporter: 'html',
});
