import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Salon Supreme - Accessibility Tests', () => {
  test('homepage should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('services section should be accessible', async ({ page }) => {
    await page.goto('/#services');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('#services')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('contact form should be accessible', async ({ page }) => {
    await page.goto('/#contact');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('#contact')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('keyboard navigation works throughout site', async ({ page }) => {
    await page.goto('/');

    // Test Tab navigation through key interactive elements
    const focusableElements = [
      'link[href="#home"]',
      'link[href="#services"]', 
      'link[href="#team"]',
      'link[href="#contact"]',
      'button[title*="Toggle"]', // Theme toggle
      'link[href="tel:312-248-4549"]',
      'link[href="#contact"][class*="book"]' // Book now button
    ];

    for (const selector of focusableElements) {
      await page.keyboard.press('Tab');
      const focusedElement = page.locator(selector);
      await expect(focusedElement).toBeFocused();
    }
  });

  test('dark mode maintains accessibility standards', async ({ page }) => {
    await page.goto('/');
    
    // Toggle to dark mode
    await page.getByRole('button', { name: /toggle dark mode/i }).click();
    await page.waitForTimeout(500);

    // Run accessibility scan in dark mode
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('form labels and error states are accessible', async ({ page }) => {
    await page.goto('/#contact');

    // Check that form fields have proper labels
    await expect(page.getByLabel('Full Name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Phone')).toBeVisible();
    await expect(page.getByLabel('Service')).toBeVisible();
    await expect(page.getByLabel('Preferred Date')).toBeVisible();
    await expect(page.getByLabel('Special Requests')).toBeVisible();

    // Test form submission with empty fields (should show validation)
    await page.getByRole('button', { name: /Book Appointment/i }).click();
    
    // Run accessibility scan on form with potential error states
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('form')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
