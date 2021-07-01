const puppeteer = require('puppeteer');

const port: number = parseInt(process.env.PORT, 10) || 8080;

describe('End to end test', () => {
  test('should open the page and check if the title is set to "Find a court or tribunal listing"', async () => {
    const browser = await puppeteer.launch({
      headless: true, // set to true and uncomment slowMo and args to see tests in realtime
      // slowMo: 80,
      // args: ['--window-size=1920,1080'],
      ignoreHTTPSErrors: true, // skips 'Your connection is not private' page
    });

    const page = await browser.newPage();
    await page.goto(`https://localhost:${port}`);

    const pageTitle = await page.$eval('.govuk-heading-xl', (e: Element) => e.innerHTML);

    expect(pageTitle).toBe('Find a court or tribunal listing');

    // cleanup
    await browser.close();
  });
});
