import { Browser, Page } from 'puppeteer';

const puppeteer = require('puppeteer');
const HomePage = require('../PageObjects/HomePage.po');
const homePage = new HomePage;
let browser: Browser;
let page: Page;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false, // set to false and uncomment slowMo and args to see tests in realtime
    slowMo: 80,
    args: ['--window-size=1920,1080'],
    ignoreHTTPSErrors: true, // skips 'Your connection is not private' page
  });
  page = await browser.newPage();
  await page.setViewport({width:1920, height: 1080});
});

describe('Finding a court or tribunal listing', () => {
  it('should open main page with "Find a court or tribunal listing" title', async () => {
    const pageTitle = await homePage.OpenHomePage(page);
    expect(pageTitle).toBe('Find a court or tribunal listing');
  });

  it('should click on the "Start now" button and navigate to Search Options page', async () => {
    const pageTitle = await homePage.ClickStartNowButton(page);
    expect(pageTitle).toContain('Find a court or tribunal list');
  });

  afterAll(() => {
    browser.close();
  });
});
