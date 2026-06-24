import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
    page.on('console', msg => {
      if (msg.type() === 'error') console.log('CONSOLE ERROR:', msg.text());
    });

    console.log('Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
    
    await browser.close();
    console.log('Done.');
  } catch (e) {
    console.error('Script Error:', e);
  }
})();
