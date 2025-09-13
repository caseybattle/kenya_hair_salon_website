import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  const consoleErrors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.waitForSelector('#testimonials');
  await page.evaluate(() => {
    document.querySelector('#testimonials')?.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForSelector('[data-testid="angled-root"]');
  await page.evaluate(() => new Promise(r => setTimeout(r, 400)));

  // Validate columns
  const colCount = await page.$$eval('[data-testid="angled-col"]', els => els.length);
  if (colCount !== 5) throw new Error(`Expected 5 angled columns, got ${colCount}`);

  // Offsets: support either fixed px or clamp() responsive values
  const styleAttr = await page.$eval('[data-testid="angled-positioner"]', el => el.getAttribute('style') || '');
  const hasResponsiveOffsets = styleAttr.includes('clamp(');
  const hasFixedOffsets = styleAttr.includes('-615px') && styleAttr.includes('+ 40px');
  const hasCalcOffsets = styleAttr.includes('calc(-116vw - 615px)') && styleAttr.includes('calc(-110vh + 40px)');
  if (!hasResponsiveOffsets && !hasFixedOffsets && !hasCalcOffsets) throw new Error('Homepage offsets not applied (neither clamp(), expected px, nor calc() found)');

  // Visibility check: ensure at least one card is in viewport
  const anyVisible = await page.$$eval('[data-testid="card"]', (nodes) => {
    const within = (r) => r.bottom > 0 && r.right > 0 && r.top < window.innerHeight && r.left < window.innerWidth;
    return nodes.some(n => within(n.getBoundingClientRect()));
  });
  if (!anyVisible) throw new Error('No testimonial cards visible in viewport');

  // Movement check
  const firstCol = (await page.$$('[data-testid="angled-col"]'))[0];
  const y1 = await firstCol.evaluate(el => el.getBoundingClientRect().top);
  await page.evaluate(() => new Promise(r => setTimeout(r, 1200)));
  const y2 = await firstCol.evaluate(el => el.getBoundingClientRect().top);
  if (y1 === y2) throw new Error('No movement detected in marquee');

  // No errors
  if (consoleErrors.length) throw new Error('Console errors:\n' + consoleErrors.join('\n'));

  await page.screenshot({ path: 'puppeteer-home-testimonials.png', fullPage: true });
  await browser.close();
  console.log('[puppeteer-home] OK - screenshot saved puppeteer-home-testimonials.png');
})().catch((e) => { console.error('[puppeteer-home] Error:', e); process.exit(1); });
