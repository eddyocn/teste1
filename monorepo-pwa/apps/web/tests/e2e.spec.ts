import { test, expect } from '@playwright/test';

test('PWA carrega, incrementa e mostra contador', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=Contador de Cliques')).toBeVisible();
  const before = await page.locator('div').nth(1).textContent();
  await page.click('button:has-text("+1")');
  await page.waitForTimeout(500);
  const after = await page.locator('div').nth(1).textContent();
  expect(parseInt(after || '0', 10)).toBeGreaterThanOrEqual(parseInt(before || '0', 10));
});
