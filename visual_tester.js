// Persistent Puppeteer browser for continuous development testing
const puppeteer = require('puppeteer');

class VisualTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.isRunning = false;
  }

  async start() {
    if (this.isRunning) {
      console.log('Visual tester already running');
      return;
    }

    try {
      console.log('🚀 Starting persistent visual tester...');
      this.browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: null,
        args: ['--no-sandbox', '--start-maximized']
      });
      
      this.page = await this.browser.newPage();
      await this.page.goto('http://localhost:3001/#services', { 
        waitUntil: 'networkidle0' 
      });
      
      this.isRunning = true;
      console.log('✅ Visual tester ready! Browser stays open for continuous testing');
      
      // Keep the process alive
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.on('data', this.handleInput.bind(this));
      
      console.log('\n📸 Commands:');
      console.log('  s = Screenshot');
      console.log('  r = Refresh page'); 
      console.log('  h = Hover test');
      console.log('  q = Quit');
      
    } catch (error) {
      console.error('❌ Failed to start visual tester:', error);
    }
  }

  async handleInput(key) {
    const command = key.toString().trim().toLowerCase();
    
    switch (command) {
      case 's':
        await this.takeScreenshot();
        break;
      case 'r':
        await this.refresh();
        break;
      case 'h':
        await this.testHover();
        break;
      case 'q':
        await this.quit();
        break;
      default:
        console.log(`Unknown command: ${command}`);
    }
  }

  async takeScreenshot() {
    if (!this.page) return;
    
    try {
      console.log('📸 Taking screenshot...');
      await this.page.screenshot({
        path: `visual_test_${Date.now()}.png`,
        fullPage: true,
        type: 'png'
      });
      console.log('✅ Screenshot saved!');
    } catch (error) {
      console.error('❌ Screenshot failed:', error);
    }
  }

  async refresh() {
    if (!this.page) return;
    
    try {
      console.log('🔄 Refreshing page...');
      await this.page.reload({ waitUntil: 'networkidle0' });
      console.log('✅ Page refreshed!');
    } catch (error) {
      console.error('❌ Refresh failed:', error);
    }
  }

  async testHover() {
    if (!this.page) return;
    
    try {
      console.log('🎯 Testing hover effects...');
      
      // Find service cards and hover
      const cards = await this.page.$$('.service-card');
      if (cards.length > 0) {
        await cards[0].hover();
        await this.page.waitForTimeout(1000);
        console.log('✅ Hover test complete!');
      } else {
        console.log('⚠️ No service cards found');
      }
    } catch (error) {
      console.error('❌ Hover test failed:', error);
    }
  }

  async quit() {
    console.log('🛑 Shutting down visual tester...');
    if (this.browser) {
      await this.browser.close();
    }
    process.exit(0);
  }
}

// Start the visual tester
const tester = new VisualTester();
tester.start();
