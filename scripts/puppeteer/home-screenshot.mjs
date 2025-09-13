import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768, deviceScaleFactor: 1 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Scroll testimonials into view
  await page.waitForSelector('#testimonials', { timeout: 20000 });
  await page.evaluate(() => {
    document.querySelector('#testimonials')?.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.evaluate(() => new Promise(r => setTimeout(r, 600)));

  // Capture element screenshot
  const section = await page.$('#testimonials');
  if (section) {
    await section.screenshot({ path: 'puppeteer-testimonials-section.png' });
  } else {
    console.error('Testimonials section not found');
  }

  // Also capture a full-page screenshot for context
  await page.screenshot({ path: 'puppeteer-home-full.png', fullPage: true });

  await browser.close();
  console.log('[puppeteer] Saved: puppeteer-testimonials-section.png and puppeteer-home-full.png');
})().catch((e) => { console.error('[puppeteer] Error:', e); process.exit(1); });
