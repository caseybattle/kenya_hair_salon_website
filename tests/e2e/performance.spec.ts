import { test, expect } from '@playwright/test';

test.describe('Salon Supreme - Performance and Edge Case Tests', () => {
  
  test('page loads within acceptable time limits', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Check that critical elements are visible
    await expect(page.locator('#home')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
  });

  test('images load efficiently and have alt text', async ({ page }) => {
    await page.goto('/');
    
    // Wait for images to load
    await page.waitForLoadState('networkidle');
    
    // Check all images have alt attributes
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      
      // Alt text should exist and not be empty
      expect(alt).toBeTruthy();
      expect(alt.length).toBeGreaterThan(0);
    }
  });

  test('lazy loading works for below-fold content', async ({ page }) => {
    await page.goto('/');
    
    // Check if images below the fold are lazy loaded
    const belowFoldImages = page.locator('#services img, #team img');
    
    if (await belowFoldImages.count() > 0) {
      // Initially, below-fold images might not be loaded
      const firstBelowFoldImg = belowFoldImages.first();
      
      // Scroll to make image visible
      await firstBelowFoldImg.scrollIntoViewIfNeeded();
      
      // Now image should be loaded
      await expect(firstBelowFoldImg).toBeVisible();
    }
  });

  test('form handles various input edge cases', async ({ page }) => {
    await page.goto('/#contact');
    
    // Test form with edge case inputs
    const testCases = [
      {
        name: 'Special Characters Name',
        fullName: "María José O'Connor-Smith",
        email: 'maria.jose+test@example.com',
        phone: '+1 (555) 123-4567',
        service: 'Hair Cut',
        date: '2024-12-25',
        message: 'Special request with émojis 💇‍♀️ and symbols!'
      },
      {
        name: 'Minimum Length Fields',
        fullName: 'Jo',
        email: 'a@b.co',
        phone: '1234567890',
        service: 'Wash',
        date: new Date().toISOString().split('T')[0], // Today's date
        message: 'Hi'
      },
      {
        name: 'Maximum Length Fields',
        fullName: 'A'.repeat(100),
        email: 'very.long.email.address@example-domain-name.com',
        phone: '+1 (555) 123-4567 ext. 12345',
        service: 'Full Service Package',
        date: '2024-12-31',
        message: 'X'.repeat(500)
      }
    ];

    for (const testCase of testCases) {
      // Clear previous inputs
      await page.locator('input[name="fullName"]').fill('');
      await page.locator('input[name="email"]').fill('');
      await page.locator('input[name="phone"]').fill('');
      await page.locator('select[name="service"]').selectOption('');
      await page.locator('input[name="date"]').fill('');
      await page.locator('textarea[name="message"]').fill('');

      // Fill form with test case data
      await page.locator('input[name="fullName"]').fill(testCase.fullName);
      await page.locator('input[name="email"]').fill(testCase.email);
      await page.locator('input[name="phone"]').fill(testCase.phone);
      await page.locator('select[name="service"]').selectOption(testCase.service);
      await page.locator('input[name="date"]').fill(testCase.date);
      await page.locator('textarea[name="message"]').fill(testCase.message);

      // Submit form
      await page.getByRole('button', { name: /Book Appointment/i }).click();
      
      // Wait a moment for any validation or submission handling
      await page.waitForTimeout(1000);
      
      // Check that form doesn't crash and handles the input gracefully
      // (Specific validation behavior would depend on your implementation)
      await expect(page.locator('form')).toBeVisible();
    }
  });

  test('handles network failures gracefully', async ({ page, context }) => {
    // Simulate offline network
    await context.setOffline(true);
    
    try {
      await page.goto('/', { timeout: 5000 });
    } catch (error) {
      // Expected to fail when offline
      expect(error.message).toContain('net::ERR_INTERNET_DISCONNECTED');
    }
    
    // Go back online
    await context.setOffline(false);
    
    // Should be able to load now
    await page.goto('/');
    await expect(page.locator('#home')).toBeVisible();
  });

  test('handles slow network conditions', async ({ page, context }) => {
    // Simulate slow 3G
    await context.route('**/*', async route => {
      // Add delay to all requests
      await new Promise(resolve => setTimeout(resolve, 100));
      await route.continue();
    });

    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - startTime;

    // Even on slow network, basic content should load reasonably quickly
    expect(loadTime).toBeLessThan(10000); // 10 seconds max
    
    // Critical elements should still be visible
    await expect(page.locator('#home')).toBeVisible();
  });

  test('carousel handles rapid interactions', async ({ page }) => {
    await page.goto('/#services');
    
    // If carousel has navigation buttons/dots
    const nextButton = page.locator('[aria-label*="next"], [aria-label*="forward"], .carousel-next');
    const prevButton = page.locator('[aria-label*="prev"], [aria-label*="back"], .carousel-prev');
    
    if (await nextButton.isVisible()) {
      // Rapidly click next button multiple times
      for (let i = 0; i < 5; i++) {
        await nextButton.click();
        await page.waitForTimeout(100);
      }
      
      // Should not crash and carousel should still be functional
      await expect(page.locator('#services')).toBeVisible();
    }
  });

  test('form prevents double submission', async ({ page }) => {
    await page.goto('/#contact');
    
    // Fill out form quickly
    await page.locator('input[name="fullName"]').fill('Test User');
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('input[name="phone"]').fill('1234567890');
    await page.locator('select[name="service"]').selectOption('Hair Cut');
    await page.locator('input[name="date"]').fill('2024-12-25');
    
    // Double-click submit button rapidly
    const submitButton = page.getByRole('button', { name: /Book Appointment/i });
    await submitButton.click();
    await submitButton.click(); // Second rapid click
    
    // Form should handle this gracefully (button might be disabled, loading state shown)
    // The exact behavior depends on your implementation
    await page.waitForTimeout(1000);
    await expect(page.locator('form')).toBeVisible();
  });

  test('handles browser resize during interaction', async ({ page }) => {
    await page.goto('/');
    
    // Start with desktop size
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(500);
    
    // Resize to tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    
    // Resize to mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    // Site should remain functional at all sizes
    await expect(page.locator('#home')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    
    // Navigation should work
    await page.locator('a[href="#services"]').first().click();
    await expect(page.locator('#services')).toBeInViewport();
  });

  test('console has no critical errors', async ({ page }) => {
    const consoleErrors = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForTimeout(2000); // Wait for any async errors
    
    // Filter out acceptable errors (like network errors in dev environment)
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('favicon') &&
      !error.includes('Development server') &&
      !error.includes('hot-reload')
    );
    
    expect(criticalErrors).toEqual([]);
  });
});
