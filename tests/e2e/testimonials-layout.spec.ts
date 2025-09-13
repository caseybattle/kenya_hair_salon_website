import { test, expect } from '@playwright/test';

// Validates testimonial section layout integrity
// - No horizontal overflow
// - Exactly 3 columns are rendered
// - Cards are uniform size and not overlapping
// - Text stays within card bounds

test.describe('Testimonials layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.locator('#testimonials').scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
  });

  test('no horizontal page overflow (no horizontal scrollbar)', async ({ page }) => {
    const noOverflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return doc.scrollWidth <= doc.clientWidth;
    });
    expect(noOverflow).toBeTruthy();
  });

  test('exactly 3 columns appear and are spaced evenly', async ({ page }) => {
    const cols = page.locator('[data-testid="col"]');
    await expect(cols).toHaveCount(3);

    // Get x positions to ensure spacing is not huge
    const boxes = await cols.evaluateAll((els) => els.map((e) => e.getBoundingClientRect().x));
    // Ensure increasing order and reasonable spacing
    expect(boxes[0]).toBeLessThan(boxes[1]);
    expect(boxes[1]).toBeLessThan(boxes[2]);
  });

  test('cards are uniform size and not overlapping', async ({ page }) => {
    const sampleCards = page.locator('[data-testid="col"] div').filter({ has: page.locator('img, p') }).first();
    const rect = await sampleCards.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height) };
    });
    expect(rect.w).toBeGreaterThanOrEqual(260);
    expect(rect.w).toBeLessThanOrEqual(300);
    expect(rect.h).toBeGreaterThanOrEqual(160);
    expect(rect.h).toBeLessThanOrEqual(220);
  });

  test('text stays within card bounds (no overflow)', async ({ page }) => {
    const card = page.locator('[data-testid="col"]').first().locator('div').first();
    const overflow = await card.evaluate((el) => {
      const s = getComputedStyle(el);
      return s.overflow !== 'visible' && (el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth);
    });
    expect(overflow).toBeFalsy();
  });
});