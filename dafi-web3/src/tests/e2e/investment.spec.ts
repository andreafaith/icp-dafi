import { test, expect } from '@playwright/test';

test.describe('Investment Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('complete investment flow', async ({ page }) => {
    // Connect wallet
    await test.step('Connect wallet', async () => {
      await page.click('button:has-text("Connect Wallet")');
      await page.waitForSelector('text=Connected');
    });

    // Create asset
    await test.step('Create asset', async () => {
      await page.click('a:has-text("Create Asset")');
      await page.fill('input[name="name"]', 'Test Farm');
      await page.fill('input[name="description"]', 'Test Description');
      await page.fill('input[name="location"]', 'Test Location');
      await page.selectOption('select[name="type"]', 'Farm');
      await page.fill('input[name="totalShares"]', '1000');
      await page.fill('input[name="pricePerShare"]', '100');
      await page.click('button:has-text("Create Asset")');
      await page.waitForSelector('text=Asset created successfully');
    });

    // Make investment
    await test.step('Make investment', async () => {
      await page.click('a:has-text("Investments")');
      await page.click('text=Test Farm');
      await page.fill('input[name="amount"]', '10000');
      await page.click('button:has-text("Invest Now")');
      await page.waitForSelector('text=Investment successful');
    });

    // Check portfolio
    await test.step('Check portfolio', async () => {
      await page.click('a:has-text("Portfolio")');
      await expect(page.locator('text=Test Farm')).toBeVisible();
      await expect(page.locator('text=10000')).toBeVisible();
      await expect(page.locator('text=100 shares')).toBeVisible();
    });

    // Check returns
    await test.step('Check returns', async () => {
      await page.click('text=Test Farm');
      await expect(page.locator('text=Returns')).toBeVisible();
      await expect(page.locator('text=Distribution History')).toBeVisible();
    });
  });

  test('compliance checks', async ({ page }) => {
    await test.step('Invalid investment amount', async () => {
      await page.click('a:has-text("Investments")');
      await page.click('text=Test Farm');
      await page.fill('input[name="amount"]', '0');
      await page.click('button:has-text("Invest Now")');
      await expect(page.locator('text=Invalid investment amount')).toBeVisible();
    });

    await test.step('Insufficient shares', async () => {
      await page.fill('input[name="amount"]', '1000000');
      await page.click('button:has-text("Invest Now")');
      await expect(page.locator('text=Insufficient shares available')).toBeVisible();
    });
  });

  test('return distribution', async ({ page }) => {
    // Login as asset owner
    await test.step('Login as owner', async () => {
      await page.click('button:has-text("Connect Wallet")');
      await page.waitForSelector('text=Connected');
    });

    // Distribute returns
    await test.step('Distribute returns', async () => {
      await page.click('a:has-text("Asset Management")');
      await page.click('text=Test Farm');
      await page.click('button:has-text("Distribute Returns")');
      await page.fill('input[name="amount"]', '5000');
      await page.selectOption('select[name="period"]', 'monthly');
      await page.click('button:has-text("Process Distribution")');
      await page.waitForSelector('text=Distribution successful');
    });

    // Verify distribution
    await test.step('Verify distribution', async () => {
      await page.click('a:has-text("Returns")');
      await expect(page.locator('text=5000')).toBeVisible();
      await expect(page.locator('text=Monthly Distribution')).toBeVisible();
    });
  });
});
