const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3001/#services');
  await page.screenshot({ path: 'snap.png', fullPage: true });
  await browser.close();
  console.log('Done');
})().catch(console.error);
