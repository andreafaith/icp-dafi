import { test, expect } from '@playwright/test';
import { mockAsset, mockUser } from '../mocks/assetMocks';

test.describe('User Acceptance Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test.describe('User Registration and Authentication', () => {
    test('should allow new user registration', async ({ page }) => {
      await test.step('Navigate to registration', async () => {
        await page.click('text=Sign Up');
      });

      await test.step('Fill registration form', async () => {
        await page.fill('[name="name"]', mockUser.name);
        await page.fill('[name="email"]', mockUser.email);
        await page.fill('[name="password"]', 'SecurePassword123!');
        await page.fill('[name="confirmPassword"]', 'SecurePassword123!');
      });

      await test.step('Submit registration', async () => {
        await page.click('button[type="submit"]');
        await expect(page.locator('text=Welcome')).toBeVisible();
      });
    });

    test('should handle user login', async ({ page }) => {
      await test.step('Navigate to login', async () => {
        await page.click('text=Login');
      });

      await test.step('Fill login form', async () => {
        await page.fill('[name="email"]', mockUser.email);
        await page.fill('[name="password"]', 'SecurePassword123!');
      });

      await test.step('Submit login', async () => {
        await page.click('button[type="submit"]');
        await expect(page.locator('text=Dashboard')).toBeVisible();
      });
    });
  });

  test.describe('Asset Management', () => {
    test('should create new agricultural asset', async ({ page }) => {
      await test.step('Navigate to asset creation', async () => {
        await page.click('text=Create Asset');
      });

      await test.step('Fill asset details', async () => {
        await page.fill('[name="name"]', mockAsset.name);
        await page.selectOption('select[name="type"]', mockAsset.type);
        await page.fill('[name="value"]', mockAsset.value.toString());
        await page.fill('[name="latitude"]', mockAsset.location.latitude.toString());
        await page.fill('[name="longitude"]', mockAsset.location.longitude.toString());
      });

      await test.step('Submit asset creation', async () => {
        await page.click('button[type="submit"]');
        await expect(page.locator(`text=${mockAsset.name}`)).toBeVisible();
      });
    });

    test('should update asset metrics', async ({ page }) => {
      await test.step('Navigate to asset details', async () => {
        await page.click(`text=${mockAsset.name}`);
      });

      await test.step('Update metrics', async () => {
        await page.click('text=Update Metrics');
        await page.fill('[name="temperature"]', '25.5');
        await page.fill('[name="humidity"]', '60');
        await page.fill('[name="soilMoisture"]', '40');
        await page.click('button[type="submit"]');
      });

      await test.step('Verify metrics update', async () => {
        await expect(page.locator('text=25.5°C')).toBeVisible();
        await expect(page.locator('text=60%')).toBeVisible();
      });
    });
  });

  test.describe('Investment Flow', () => {
    test('should complete investment process', async ({ page }) => {
      await test.step('Navigate to investment page', async () => {
        await page.click('text=Invest');
        await page.click(`text=${mockAsset.name}`);
      });

      await test.step('Review investment details', async () => {
        await expect(page.locator(`text=${mockAsset.value}`)).toBeVisible();
        await expect(page.locator('text=Investment Terms')).toBeVisible();
      });

      await test.step('Make investment', async () => {
        await page.fill('[name="investmentAmount"]', '1000');
        await page.click('text=Invest Now');
      });

      await test.step('Confirm investment', async () => {
        await expect(page.locator('text=Investment Successful')).toBeVisible();
        await expect(page.locator('text=Transaction Hash')).toBeVisible();
      });
    });

    test('should track investment performance', async ({ page }) => {
      await test.step('Navigate to portfolio', async () => {
        await page.click('text=Portfolio');
      });

      await test.step('View investment details', async () => {
        await expect(page.locator(`text=${mockAsset.name}`)).toBeVisible();
        await expect(page.locator('text=Returns')).toBeVisible();
        await expect(page.locator('text=Performance Graph')).toBeVisible();
      });
    });
  });

  test.describe('Asset Monitoring', () => {
    test('should display real-time metrics', async ({ page }) => {
      await test.step('Navigate to monitoring dashboard', async () => {
        await page.click('text=Monitor');
      });

      await test.step('View metrics dashboard', async () => {
        await expect(page.locator('text=Temperature')).toBeVisible();
        await expect(page.locator('text=Humidity')).toBeVisible();
        await expect(page.locator('text=Soil Moisture')).toBeVisible();
      });

      await test.step('Check real-time updates', async () => {
        // Wait for metrics to update
        await page.waitForTimeout(5000);
        const initialTemp = await page.locator('[data-testid="temperature"]').textContent();
        await page.waitForTimeout(5000);
        const updatedTemp = await page.locator('[data-testid="temperature"]').textContent();
        expect(initialTemp).not.toBe(updatedTemp);
      });
    });

    test('should generate performance reports', async ({ page }) => {
      await test.step('Navigate to reports', async () => {
        await page.click('text=Reports');
      });

      await test.step('Generate report', async () => {
        await page.click('text=Generate Report');
        await page.selectOption('select[name="reportType"]', 'performance');
        await page.click('text=Download');
      });

      await test.step('Verify download', async () => {
        const download = await page.waitForEvent('download');
        expect(download.suggestedFilename()).toContain('performance-report');
      });
    });
  });

  test.describe('User Experience', () => {
    test('should handle error states gracefully', async ({ page }) => {
      await test.step('Test network error', async () => {
        await page.route('**/api/**', route => route.abort());
        await page.reload();
        await expect(page.locator('text=Network Error')).toBeVisible();
        await expect(page.locator('text=Retry')).toBeVisible();
      });

      await test.step('Test invalid input', async () => {
        await page.click('text=Create Asset');
        await page.click('button[type="submit"]');
        await expect(page.locator('text=Required field')).toBeVisible();
      });
    });

    test('should be responsive', async ({ page }) => {
      // Test mobile view
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(page.locator('button[aria-label="Menu"]')).toBeVisible();

      // Test tablet view
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(page.locator('nav')).toBeVisible();

      // Test desktop view
      await page.setViewportSize({ width: 1440, height: 900 });
      await expect(page.locator('nav')).toBeVisible();
    });

    test('should provide helpful feedback', async ({ page }) => {
      await test.step('Test loading states', async () => {
        await page.route('**/api/assets', route => {
          return new Promise(resolve => setTimeout(() => route.continue(), 1000));
        });
        await page.goto('http://localhost:3000/assets');
        await expect(page.locator('[role="progressbar"]')).toBeVisible();
      });

      await test.step('Test success messages', async () => {
        await page.click('text=Create Asset');
        await page.fill('[name="name"]', mockAsset.name);
        await page.click('button[type="submit"]');
        await expect(page.locator('text=Asset created successfully')).toBeVisible();
      });
    });
  });
});
