import { test, expect } from '@playwright/test';

test.describe('Salon Supreme - Critical Booking Flow', () => {
  test('complete appointment booking journey', async ({ page }) => {
    // Navigate to the salon website
    await page.goto('/');
    
    // Test hero section loads correctly
    await expect(page.getByRole('heading', { name: /Salon Supreme/i })).toBeVisible();
    await expect(page.getByText('LUXURY HAIR SALON')).toBeVisible();
    
    // Test services section displays and scrolls
    await page.locator('#services').scrollIntoView();
    await expect(page.getByRole('heading', { name: /Our Services/i })).toBeVisible();
    
    // Verify service cards are visible in marquee
    await expect(page.getByText('Precision Cuts & Styling')).toBeVisible();
    await expect(page.getByText('Starting at $75')).toBeVisible();
    
    // Navigate to contact/booking section
    await page.getByRole('link', { name: /Book Appointment/i }).first().click();
    
    // Fill out booking form
    await page.getByLabel('Full Name').fill('Jane Customer');
    await page.getByLabel('Email').fill('jane@example.com');
    await page.getByLabel('Phone').fill('(555) 123-4567');
    
    // Select a service
    await page.getByRole('combobox', { name: /Service/i }).selectOption('Color & Highlights');
    
    // Set preferred date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    await page.getByLabel('Preferred Date').fill(dateString);
    
    // Add special requests
    await page.getByLabel('Special Requests').fill('First time visiting, looking forward to the experience!');
    
    // Submit booking
    await page.getByRole('button', { name: /Book Appointment/i }).click();
    
    // Verify submission success (check for success message or form reset)
    // Note: Adjust based on your actual form behavior
    await expect(page.getByText(/thank you/i)).toBeVisible({ timeout: 5000 });
  });

  test('navigation and mobile responsiveness', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Test hero section scales correctly
    await expect(page.getByRole('heading', { name: /Salon Supreme/i })).toBeVisible();
    
    // Test navigation menu exists
    await expect(page.getByRole('link', { name: /Home/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Services/i })).toBeVisible();
    
    // Test services section on mobile
    await page.getByRole('link', { name: /Services/i }).click();
    await expect(page.locator('#services')).toBeInViewport();
    
    // Test dark mode toggle
    const themeToggle = page.getByRole('button', { name: /toggle dark mode/i });
    await themeToggle.click();
    
    // Wait for theme change (check for dark theme class or style)
    await page.waitForTimeout(500);
    
    // Test phone number link is clickable
    await expect(page.getByRole('link', { name: /CALL US: 312-248-4549/i })).toBeVisible();
  });

  test('services carousel functionality', async ({ page }) => {
    await page.goto('/#services');
    
    // Wait for services to load
    await expect(page.getByRole('heading', { name: /Our Services/i })).toBeVisible();
    
    // Verify all services are present
    const services = [
      'Precision Cuts & Styling',
      'Luxury Hair Treatments', 
      'Extensions & Updo\'s',
      'Color & Highlights',
      'Blowouts & Styling',
      'Bridal & Events'
    ];
    
    for (const service of services) {
      await expect(page.getByText(service)).toBeVisible();
    }
    
    // Test service card hover effects (check for transform or style changes)
    const firstServiceCard = page.locator('.service-card').first();
    await firstServiceCard.hover();
    
    // Verify price buttons are clickable
    await expect(page.getByRole('button', { name: /Starting at \$/i }).first()).toBeVisible();
  });
});
