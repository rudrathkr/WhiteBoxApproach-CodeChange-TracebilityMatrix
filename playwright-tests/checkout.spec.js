const { test, expect } = require('@playwright/test');

test('checkout test', async ({ page }) => {

  await page.goto('http://localhost:4200');

  await page.click('#checkoutBtn');

  await expect(
    page.locator('#result')
  ).toContainText('ORDERS');
});
