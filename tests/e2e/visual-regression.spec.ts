import { test, expect } from '@playwright/test';

test.describe('Salon Supreme - Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Wait for fonts and images to load to avoid flaky screenshots
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for any dynamic content/animations to settle
    await page.waitForTimeout(1000);
  });

  test('homepage hero section matches baseline', async ({ page }) => {
    await page.locator('#home').scrollIntoViewIfNeeded();
    
    await expect(page.locator('#home')).toHaveScreenshot('hero-section.png', {
      threshold: 0.2,
      maxDiffPixels: 1000,
    });
  });

  test('services carousel matches baseline', async ({ page }) => {
    await page.locator('#services').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500); // Let carousel settle

    await expect(page.locator('#services')).toHaveScreenshot('services-section.png', {
      threshold: 0.2,
      maxDiffPixels: 1000,
    });
  });

  test('contact form matches baseline', async ({ page }) => {
    await page.locator('#contact').scrollIntoViewIfNeeded();

    await expect(page.locator('#contact')).toHaveScreenshot('contact-form.png', {
      threshold: 0.2,
      maxDiffPixels: 500,
    });
  });

  test('navigation bar (both states)', async ({ page }) => {
    // Test navigation at top
    await expect(page.locator('nav')).toHaveScreenshot('nav-top.png');

    // Scroll down and test sticky nav
    await page.locator('#services').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    
    await expect(page.locator('nav')).toHaveScreenshot('nav-sticky.png');
  });

  test('dark mode homepage matches baseline', async ({ page }) => {
    // Toggle to dark mode
    await page.getByRole('button', { name: /toggle.*dark.*mode/i }).click();
    await page.waitForTimeout(500);

    await expect(page.locator('body')).toHaveScreenshot('homepage-dark.png', {
      fullPage: true,
      threshold: 0.2,
      maxDiffPixels: 2000,
    });
  });

  test('service card hover states', async ({ page }) => {
    await page.locator('#services').scrollIntoViewIfNeeded();
    
    // Hover over first service card
    const firstCard = page.locator('.service-card').first();
    await firstCard.hover();
    await page.waitForTimeout(300); // Wait for hover animation
    
    await expect(firstCard).toHaveScreenshot('service-card-hover.png', {
      threshold: 0.3,
    });
  });

  test('mobile responsive layout', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Test mobile hero
    await expect(page.locator('#home')).toHaveScreenshot('mobile-hero.png', {
      threshold: 0.2,
    });

    // Test mobile services (should stack vertically)
    await page.locator('#services').scrollIntoViewIfNeeded();
    await expect(page.locator('#services')).toHaveScreenshot('mobile-services.png', {
      threshold: 0.2,
    });

    // Test mobile navigation (hamburger menu if implemented)
    await expect(page.locator('nav')).toHaveScreenshot('mobile-nav.png');
  });

  test('tablet responsive layout', async ({ page }) => {
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('tablet-full-page.png', {
      fullPage: true,
      threshold: 0.2,
      maxDiffPixels: 3000,
    });
  });

  test('form validation error states', async ({ page }) => {
    await page.locator('#contact').scrollIntoViewIfNeeded();
    
    // Submit empty form to trigger validation
    await page.getByRole('button', { name: /Book Appointment/i }).click();
    await page.waitForTimeout(500);

    // Screenshot form with validation errors
    await expect(page.locator('form')).toHaveScreenshot('form-validation-errors.png', {
      threshold: 0.2,
    });
  });

  test('loading states and animations', async ({ page }) => {
    // Test any loading states or animations
    // This might include carousel transitions, form submission loading, etc.
    await page.locator('#services').scrollIntoViewIfNeeded();
    
    // If carousel has auto-play or transition effects
    const carousel = page.locator('.carousel, .services-grid');
    if (await carousel.isVisible()) {
      await expect(carousel).toHaveScreenshot('carousel-state.png', {
        threshold: 0.3,
      });
    }
  });
});
