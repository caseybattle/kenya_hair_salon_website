const puppeteer = require('puppeteer');

(async () => {
  console.log('🚀 Starting debug check...');
  
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log('🌐 Navigating to page...');
    await page.goto('http://localhost:3001/#services', { 
      waitUntil: 'networkidle2',
      timeout: 10000
    });
    
    console.log('✅ Page loaded successfully');
    
    // Check for services container
    const container = await page.$('.services-marquee-container');
    console.log('📦 Services container found:', !!container);
    
    if (container) {
      const containerStyles = await page.evaluate(() => {
        const element = document.querySelector('.services-marquee-container');
        if (!element) return null;
        
        const styles = getComputedStyle(element);
        return {
          position: styles.position,
          overflow: styles.overflow,
          width: styles.width,
          height: styles.height
        };
      });
      console.log('🎨 Container styles:', containerStyles);
    }
    
    // Check for service items with correct classes
    const marqueeItems = await page.$$('.marquee-item');
    console.log('🧩 Marquee items found:', marqueeItems.length);
    
    const serviceCards = await page.$$('.service-card');
    console.log('🃏 Service cards found:', serviceCards.length);
    
    // Analyze marquee positioning and fade effect
    const marqueeAnalysis = await page.evaluate(() => {
      const container = document.querySelector('.services-marquee-container');
      if (!container) return null;
      
      const marquee = container.querySelector('[data-orientation="horizontal"]'); // Marquee component
      const styles = getComputedStyle(container);
      
      return {
        container: {
          width: styles.width,
          height: styles.height,
          overflow: styles.overflow,
          position: styles.position,
          hasBeforeGradient: window.getComputedStyle(container, '::before').content !== 'none',
          hasAfterGradient: window.getComputedStyle(container, '::after').content !== 'none'
        },
        marqueeExists: !!marquee,
        marqueeClasses: marquee ? marquee.className : null
      };
    });
    console.log('🎠 Marquee analysis:', JSON.stringify(marqueeAnalysis, null, 2));
    
    // Check for fade overlay gradients
    const fadeOverlayCheck = await page.evaluate(() => {
      const container = document.querySelector('.services-marquee-container');
      if (!container) return 'Container not found';
      
      // Check if pseudo-elements exist with gradients
      const beforeStyle = window.getComputedStyle(container, '::before');
      const afterStyle = window.getComputedStyle(container, '::after');
      
      return {
        beforePseudo: {
          content: beforeStyle.content,
          background: beforeStyle.background,
          position: beforeStyle.position,
          width: beforeStyle.width,
          height: beforeStyle.height,
          left: beforeStyle.left,
          right: beforeStyle.right
        },
        afterPseudo: {
          content: afterStyle.content,
          background: afterStyle.background,
          position: afterStyle.position,
          width: afterStyle.width,
          height: afterStyle.height,
          left: afterStyle.left,
          right: afterStyle.right
        }
      };
    });
    console.log('🌅 Fade overlay analysis:', JSON.stringify(fadeOverlayCheck, null, 2));
    
    // Take screenshot
    await page.screenshot({ path: 'debug_services_screenshot.png', fullPage: true });
    console.log('📸 Screenshot saved as debug_services_screenshot.png');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  console.log('🏁 Debug check completed');
})();
