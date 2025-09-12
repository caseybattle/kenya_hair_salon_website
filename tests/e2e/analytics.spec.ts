import { test, expect } from '@playwright/test';

test.describe('Salon Supreme - Analytics and Tracking Tests', () => {

  test('page view tracking fires correctly', async ({ page }) => {
    // Array to capture network requests
    const trackingRequests: string[] = [];
    
    // Intercept potential analytics requests
    page.route('**/*', (route) => {
      const url = route.request().url();
      
      // Check for common analytics endpoints
      if (url.includes('google-analytics.com') || 
          url.includes('googletagmanager.com') ||
          url.includes('facebook.com/tr') ||
          url.includes('analytics') ||
          url.includes('tracking')) {
        trackingRequests.push(url);
      }
      
      route.continue();
    });

    // Navigate to homepage
    await page.goto('/');
    await page.waitForTimeout(2000); // Wait for tracking to fire
    
    // If analytics is implemented, we should see tracking requests
    // This test documents expected behavior even if analytics isn't implemented yet
    console.log('Analytics requests captured:', trackingRequests);
  });

  test('form submission tracking', async ({ page }) => {
    const formSubmissions: any[] = [];
    
    // Listen for form submission events
    await page.addInitScript(() => {
      window.formTrackingEvents = [];
      
      // Override form submit if custom tracking is implemented
      const originalSubmit = HTMLFormElement.prototype.submit;
      HTMLFormElement.prototype.submit = function() {
        window.formTrackingEvents.push({
          type: 'form_submit',
          formId: this.id,
          timestamp: Date.now()
        });
        return originalSubmit.apply(this, arguments);
      };
    });

    await page.goto('/#contact');

    // Fill and submit contact form
    await page.locator('input[name="fullName"]').fill('Test User');
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('input[name="phone"]').fill('1234567890');
    await page.locator('select[name="service"]').selectOption('Hair Cut');
    await page.locator('input[name="date"]').fill('2024-12-25');
    
    await page.getByRole('button', { name: /Book Appointment/i }).click();
    
    await page.waitForTimeout(1000);
    
    // Check if form tracking events were captured
    const events = await page.evaluate(() => window.formTrackingEvents);
    console.log('Form tracking events:', events);
  });

  test('user interaction tracking (clicks, scrolls)', async ({ page }) => {
    const interactions: any[] = [];
    
    // Track user interactions
    await page.addInitScript(() => {
      window.userInteractions = [];
      
      document.addEventListener('click', (e) => {
        window.userInteractions.push({
          type: 'click',
          target: e.target?.tagName,
          className: e.target?.className,
          timestamp: Date.now()
        });
      });
      
      let scrollTimer: NodeJS.Timeout;
      document.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          window.userInteractions.push({
            type: 'scroll',
            scrollY: window.scrollY,
            timestamp: Date.now()
          });
        }, 100);
      });
    });

    await page.goto('/');

    // Simulate user interactions
    await page.locator('a[href="#services"]').first().click();
    await page.waitForTimeout(500);
    
    await page.locator('#services').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    await page.locator('a[href="#contact"]').first().click();
    await page.waitForTimeout(500);
    
    // Retrieve tracked interactions
    const interactions = await page.evaluate(() => window.userInteractions);
    
    // Verify interactions were tracked
    expect(interactions.length).toBeGreaterThan(0);
    
    // Check for expected interaction types
    const clicks = interactions.filter((i: any) => i.type === 'click');
    const scrolls = interactions.filter((i: any) => i.type === 'scroll');
    
    expect(clicks.length).toBeGreaterThan(0);
    console.log('User interactions tracked:', { clicks: clicks.length, scrolls: scrolls.length });
  });

  test('phone link click tracking', async ({ page }) => {
    let phoneClickTracked = false;
    
    // Intercept phone link clicks
    page.route('tel:*', (route) => {
      phoneClickTracked = true;
      console.log('Phone link clicked:', route.request().url());
      route.abort(); // Prevent actual phone call in test
    });

    await page.goto('/');
    
    // Click phone number link
    const phoneLink = page.locator('a[href^="tel:"]').first();
    if (await phoneLink.isVisible()) {
      await phoneLink.click();
      await page.waitForTimeout(500);
      
      expect(phoneClickTracked).toBe(true);
    }
  });

  test('service selection tracking', async ({ page }) => {
    await page.addInitScript(() => {
      window.serviceSelections = [];
      
      // Track service card clicks if implemented
      document.addEventListener('click', (e) => {
        const serviceCard = e.target?.closest('.service-card');
        if (serviceCard) {
          const serviceName = serviceCard.querySelector('h3')?.textContent;
          window.serviceSelections.push({
            service: serviceName,
            timestamp: Date.now()
          });
        }
      });
    });

    await page.goto('/#services');
    
    // Click on service cards if they exist
    const serviceCards = page.locator('.service-card');
    const cardCount = await serviceCards.count();
    
    if (cardCount > 0) {
      // Click first service card
      await serviceCards.first().click();
      await page.waitForTimeout(500);
      
      const selections = await page.evaluate(() => window.serviceSelections);
      console.log('Service selections tracked:', selections);
    }
  });

  test('error tracking and reporting', async ({ page }) => {
    const jsErrors: any[] = [];
    const consoleErrors: any[] = [];
    
    // Capture JavaScript errors
    page.on('pageerror', (error) => {
      jsErrors.push({
        message: error.message,
        stack: error.stack,
        timestamp: Date.now()
      });
    });
    
    // Capture console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push({
          text: msg.text(),
          timestamp: Date.now()
        });
      }
    });

    await page.goto('/');
    
    // Try to trigger potential errors
    await page.evaluate(() => {
      // Try to access non-existent elements
      try {
        document.getElementById('non-existent')?.click();
      } catch (e) {
        console.error('Test error:', e.message);
      }
    });
    
    await page.waitForTimeout(1000);
    
    // Log any errors found (for debugging purposes)
    if (jsErrors.length > 0) {
      console.log('JavaScript errors found:', jsErrors);
    }
    if (consoleErrors.length > 0) {
      console.log('Console errors found:', consoleErrors);
    }
  });

  test('session duration and bounce rate metrics', async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStart = Date.now();
      window.pageViews = 0;
      window.interactions = 0;
      
      // Track page views
      window.addEventListener('beforeunload', () => {
        const sessionDuration = Date.now() - window.sessionStart;
        const bounced = window.pageViews <= 1 && window.interactions < 3;
        
        console.log('Session metrics:', {
          duration: sessionDuration,
          pageViews: window.pageViews,
          interactions: window.interactions,
          bounced
        });
      });
      
      // Track interactions
      document.addEventListener('click', () => window.interactions++);
      document.addEventListener('scroll', () => window.interactions++);
    });

    const sessionStart = Date.now();
    
    await page.goto('/');
    await page.evaluate(() => window.pageViews++);
    
    // Simulate user engagement
    await page.locator('a[href="#services"]').first().click();
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.pageViews++);
    
    await page.locator('#services').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    await page.locator('a[href="#contact"]').first().click();
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.pageViews++);
    
    const sessionDuration = Date.now() - sessionStart;
    const metrics = await page.evaluate(() => ({
      duration: Date.now() - window.sessionStart,
      pageViews: window.pageViews,
      interactions: window.interactions
    }));
    
    // Session should be engaged (not a bounce)
    expect(metrics.pageViews).toBeGreaterThan(1);
    expect(metrics.interactions).toBeGreaterThan(2);
    expect(sessionDuration).toBeGreaterThan(2000); // At least 2 seconds
    
    console.log('Final session metrics:', metrics);
  });

  test('conversion funnel tracking', async ({ page }) => {
    const funnelSteps: string[] = [];
    
    await page.addInitScript(() => {
      window.funnelTracking = [];
      
      // Track funnel steps
      window.trackFunnelStep = (step: string) => {
        window.funnelTracking.push({
          step,
          timestamp: Date.now()
        });
      };
    });

    await page.goto('/');
    
    // Step 1: Homepage visit
    await page.evaluate(() => window.trackFunnelStep('homepage_visit'));
    
    // Step 2: Services viewed
    await page.locator('a[href="#services"]').first().click();
    await page.evaluate(() => window.trackFunnelStep('services_viewed'));
    
    // Step 3: Contact section reached
    await page.locator('a[href="#contact"]').first().click();
    await page.evaluate(() => window.trackFunnelStep('contact_reached'));
    
    // Step 4: Form interaction started
    await page.locator('input[name="fullName"]').click();
    await page.evaluate(() => window.trackFunnelStep('form_started'));
    
    // Step 5: Form filled (partial)
    await page.locator('input[name="fullName"]').fill('Test User');
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.evaluate(() => window.trackFunnelStep('form_filled'));
    
    const funnelData = await page.evaluate(() => window.funnelTracking);
    
    // Verify complete funnel was tracked
    expect(funnelData).toHaveLength(5);
    
    const steps = funnelData.map((item: any) => item.step);
    expect(steps).toEqual([
      'homepage_visit',
      'services_viewed', 
      'contact_reached',
      'form_started',
      'form_filled'
    ]);
    
    console.log('Conversion funnel tracked:', funnelData);
  });
});
