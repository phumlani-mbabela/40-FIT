
import { test, expect } from '@playwright/test';

test('navbar links present', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.getByRole('link', { name: 'FortyPlusFit' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Subscriptions' })).toBeVisible();
});
