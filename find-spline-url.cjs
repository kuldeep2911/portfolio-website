const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('request', request => {
    const url = request.url();
    if (url.includes('.splinecode')) {
      console.log('FOUND SPLINECODE URL:', url);
    }
  });

  console.log('Navigating to Spline viewer...');
  await page.goto('https://my.spline.design/verticallayoutaccordioncopycopy-lSyu035aDwVtX6cjAfcp5n2Z-O7g/');
  
  // Wait up to 5 seconds
  await new Promise(r => setTimeout(r, 5000));
  
  await browser.close();
  console.log('Done.');
})();
