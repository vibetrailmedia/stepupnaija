import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should display the main landing page elements', async ({ page }) => {
    await page.goto('/');

    // Check for main heading
    await expect(page.getByRole('heading', { name: /step up naija/i })).toBeVisible();
    
    // Check for key call-to-action buttons
    await expect(page.getByRole('button', { name: /get started/i })).toBeVisible();
    
    // Check for navigation
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('should have proper SEO meta tags', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/step up naija/i);
    
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /civic engagement/i);
    
    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /step up naija/i);
  });

  test('should be accessible with keyboard navigation', async ({ page }) => {
    await page.goto('/');

    // Test keyboard navigation
    await page.keyboard.press('Tab');
    
    // Check if focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test skip links (should be visible when focused)
    await page.keyboard.press('Tab');
    const skipLink = page.getByText(/skip to main content/i);
    await expect(skipLink).toBeVisible();
  });

  test('should handle mobile viewport correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check mobile navigation
    const mobileMenu = page.getByRole('button', { name: /menu/i });
    await expect(mobileMenu).toBeVisible();
    
    // Test mobile menu functionality
    await mobileMenu.click();
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('should load performance metrics', async ({ page }) => {
    await page.goto('/');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Check that performance monitoring is working
    const performanceMetrics = await page.evaluate(() => {
      return window.performance.timing;
    });

    expect(performanceMetrics.loadEventEnd).toBeGreaterThan(0);
    expect(performanceMetrics.domContentLoadedEventEnd).toBeGreaterThan(0);
  });
});