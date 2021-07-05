import { Browser, Page } from 'puppeteer';

const puppeteer = require('puppeteer');

const port: number = parseInt(process.env.PORT, 10) || 8080;

describe('End to end test', () => {
  const PAGE_URL = `https://localhost:${port}`;
  let browser: Browser;
  let page: Page;


  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false, // set to false and uncomment slowMo and args to see tests in realtime
      slowMo: 80,
      args: ['--window-size=1920,1080'],
      ignoreHTTPSErrors: true, // skips 'Your connection is not private' page
    });
  });

  it('should open main page with "Find a court or tribunal listing" title', async () => {
    page = await browser.newPage();
    await page.goto(PAGE_URL);

    const pageTitle = await page.$eval('h1.govuk-heading-xl', (e: Element) => e.textContent);
    expect(pageTitle).toBe('Find a court or tribunal listing');
  });

  it('should open the page and press on the "Start now" button rendering title and 2 radio inputs', async () => {
    await page.click('.govuk-button--start');

    const pageTitle = await page.$eval('h1.govuk-fieldset__heading', (e: Element) => e.textContent);
    const radioElements = await page.$$('div.govuk-radios__item');

    expect(pageTitle).toContain('Find a court or tribunal list');
    expect(radioElements.length).toBe(2);
  });

  afterAll(() => {
    browser.close();
  });
});
