const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('---ALL_SPLINE_OBJECTS---') || text.includes('---SPLINE_VARIABLES---') || text.startsWith('[')) {
      console.log('PAGE LOG:', text);
    }
  });

  console.log('Navigating to local site...');
  await page.goto('http://localhost:5173/#skills');
  
  // Wait up to 10 seconds for Spline to load
  await new Promise(r => setTimeout(r, 10000));
  
  await browser.close();
  console.log('Done.');
})();
