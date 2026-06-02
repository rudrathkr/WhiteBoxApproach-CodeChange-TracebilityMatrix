const { test, expect } = require('@playwright/test');

test('login test', async ({ page }) => {

  await page.goto('http://localhost:4200');

  await page.fill('#username', 'admin');

  await page.fill('#password', 'password');

  await page.click('#loginBtn');

  await expect(page).toHaveURL(/dashboard/);
});
