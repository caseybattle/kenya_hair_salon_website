// Test script to capture browser screenshots
const puppeteer = require('puppeteer');

async function testScreenshot() {
  try {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ 
      headless: false,
      defaultViewport: null 
    });
    
    const page = await browser.newPage();
    
    console.log('Navigating to localhost:3001...');
    await page.goto('http://localhost:3001/#services', {
      waitUntil: 'networkidle0' 
    });
    
    console.log('Taking screenshot...');
    const screenshot = await page.screenshot({
      path: 'visual_test.png',
      fullPage: true,
      type: 'png'
    });
    
    console.log('Screenshot saved successfully!');
    
    await browser.close();
    return true;
  } catch (error) {
    console.error('Screenshot test failed:', error);
    return false;
  }
}

testScreenshot();
