// Quick screenshot function for immediate testing
const puppeteer = require('puppeteer');

async function quickScreenshot() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  console.log('📸 Taking quick screenshot...');
  await page.goto('http://localhost:3001/#services', { waitUntil: 'networkidle0' });
  
  await page.screenshot({
    path: 'current_view.png',
    fullPage: true,
    type: 'png'
  });
  
  console.log('✅ Screenshot saved as current_view.png');
  await browser.close();
}

quickScreenshot().catch(console.error);
