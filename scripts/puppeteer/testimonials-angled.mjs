import puppeteer from 'puppeteer';
import { spawn } from 'child_process';

async function ensureDevServer() {
  const url = 'http://localhost:3000/testimonials-preview';
  try {
    const r = await fetch(url, { method: 'HEAD' });
    if (r.ok) return () => {};
  } catch {}

  console.log('[puppeteer] starting dev server...');
  const child = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: false,
  });
  // crude wait; Playwright normally handles this, but here we poll
  await new Promise((resolve) => setTimeout(resolve, 6000));
  return () => child.kill();
}

(async () => {
  const stop = await ensureDevServer();
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();

  // Set deterministic viewport
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });

  // Capture console errors
  const consoleErrors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });

  page.setDefaultNavigationTimeout(45000);
  page.setDefaultTimeout(15000);

  // Navigate and wait for root container
  await page.goto('http://localhost:3000/testimonials-preview', { waitUntil: 'networkidle0' });
  await page.waitForSelector('[data-testid="angled-root"], .testimonials');

  // assert no horizontal overflow
  const noOverflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth <= doc.clientWidth;
  });
  if (!noOverflow) throw new Error('Horizontal overflow detected');

  // The container should only contain the marquee and its cards
  const extraTopLevel = await page.$$eval('[data-testid="marquee-wrap"]', (els) => {
    const wrap = els[0];
    if (!wrap) return -1;
    // Count element children that are not script/style/template
    return Array.from(wrap.children).filter((c) => !['SCRIPT', 'STYLE', 'TEMPLATE'].includes(c.tagName)).length;
  });
  if (extraTopLevel !== 1) throw new Error(`Unexpected content inside marquee-wrap: ${extraTopLevel}`);

  // Exact card count match expected
  const expectedCards = await page.$eval('[data-testid=\"marquee-wrap\"]', el => parseInt(el.getAttribute('data-expected-cards') || '0', 10));
  const actualCards = await page.$$eval('[data-testid=\"card\"]', els => els.length);
  if (actualCards !== expectedCards) throw new Error(`Card count mismatch: expected ${expectedCards}, got ${actualCards}`);

  // Avatars visible in most cards (img opacity/display OR fallback visible)
  await page.waitForSelector('[data-testid=\"card\"] img, [data-testid=\"card\"] [data-fallback]');

  // Patiently wait up to 10s for images to load/fade in
  const avatarOk = await page.waitForFunction(() => {
    const cards = Array.from(document.querySelectorAll('[data-testid="card"]'));
    const sample = cards.slice(0, Math.min(12, cards.length));
    let ok = 0;
    for (const card of sample) {
      const img = card.querySelector('img');
      let v = false;
      if (img) {
        const cs = getComputedStyle(img);
        const r = img.getBoundingClientRect();
        v = cs.display !== 'none' && parseFloat(cs.opacity || '1') >= 0.5 && r.width > 0 && r.height > 0;
      }
      if (!v) {
        const fb = card.querySelector('[data-fallback]');
        if (fb) {
          const csf = getComputedStyle(fb);
          v = csf.display !== 'none';
        }
      }
      if (v) ok++;
    }
    return ok >= Math.max(6, Math.floor(cards.length * 0.4));
  }, { timeout: 10000 });
  if (!avatarOk) {
    throw new Error('Avatars not sufficiently visible after waiting');
  }

  // If the angled component exists, validate columns
  const hasAngled = await page.$('[data-testid="angled-root"]');
  if (hasAngled) {
    await page.waitForSelector('[data-testid="angled-col"]');
    const colCount = await page.$$eval('[data-testid="angled-col"]', els => els.length);
    if (colCount !== 5) throw new Error(`Expected 5 angled columns, got ${colCount}`);
    console.log('[puppeteer] angled columns:', colCount);

    // Verify horizontal offset applied to the positioner
    const styleAttr = await page.$eval('[data-testid=\"angled-positioner\"]', el => el.getAttribute('style') || '');
    if (!styleAttr.includes('-615px')) throw new Error('Expected horizontal offset -615px not applied');
    if (!styleAttr.includes('+ 40px')) throw new Error('Expected vertical offset +40px not applied');

    // Ensure the first column is not too far to the right (left-shifted)
    const xFirstCol = await page.$eval('[data-testid="angled-col"]', el => el.getBoundingClientRect().left);
    const vw = await page.evaluate(() => window.innerWidth);
    if (xFirstCol > vw * 0.8) throw new Error(`Columns not left-shifted enough (x=${xFirstCol}, vw=${vw})`);

    // Check that cards render
    const cardCount = await page.$$eval('[data-testid="card"]', els => els.length);
    if (cardCount < 3) throw new Error('Expected at least 3 testimonial cards');

    // Sample a column and detect movement over time (basic animation check)
    const firstCol = (await page.$$('[data-testid="angled-col"]'))[0];
    if (firstCol) {
      const y1 = await firstCol.evaluate(el => el.getBoundingClientRect().top);
      const t1 = await firstCol.evaluate(el => getComputedStyle(el).transform);
      await page.evaluate(() => new Promise(r => setTimeout(r, 1200)));
      const y2 = await firstCol.evaluate(el => el.getBoundingClientRect().top);
      const t2 = await firstCol.evaluate(el => getComputedStyle(el).transform);
      console.log('[puppeteer] movement delta:', y2 - y1);
      console.log('[puppeteer] transform changed:', t1 !== t2);
    }
  } else {
    // Fallback: check non-angled marquee by common testids
    const cols = await page.$$('[data-testid="col"]');
    if (cols.length === 0) throw new Error('No marquee columns were found');
  }

  await page.screenshot({ path: 'puppeteer-testimonials.png', fullPage: true });
  // Assert no console errors
  if (consoleErrors.length) {
    throw new Error('Console errors detected:\n' + consoleErrors.join('\n'));
  }

  await browser.close();
  stop();
  console.log('[puppeteer] Done. Screenshot saved to puppeteer-testimonials.png');
})().catch((err) => {
  console.error('[puppeteer] Error:', err);
  process.exit(1);
});
