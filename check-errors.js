import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.error('PAGE ERROR:', error.message));
  
  console.log("Navigating to http://localhost:8085/ ...");
  await page.goto('http://localhost:8085/');
  
  console.log("Navigating to http://localhost:8085/jobseeker/certificates ...");
  await page.goto('http://localhost:8085/jobseeker/certificates');
  
  await browser.close();
})();
