
import { HomePagePo } from '../PageObjects/HomePage.po';
import { SearchOptionPo } from '../PageObjects/SearchOption.po';

// const puppeteer = require('puppeteer');
const homePage = new HomePagePo;

let searchOptionPage: SearchOptionPo;

beforeAll(async () => {
  // browser = await puppeteer.launch({
  //   headless: true, // set to false and uncomment slowMo and args to see tests in realtime
  //   // slowMo: 80,
  //   // args: ['--window-size=1920,1080'],
  //   ignoreHTTPSErrors: true, // skips 'Your connection is not private' page
  // });

  // const page = await browser.newPage();
  // await page.setViewport({width:1920, height: 1080});
});

describe('Finding a court or tribunal listing', () => {
  it('should open main page with "Find a court or tribunal listing" title', async () => {
    await homePage.OpenHomePage();
    expect(await homePage.getPageTitle()).toBe('Find a court or tribunal listing');
  });

  it('should click on the "Start now" button and navigate to Search Options page', async () => {
    searchOptionPage = await homePage.ClickStartNowButton();
    expect(await searchOptionPage.getPageTitle()).toContain('Find a court or tribunal list');
  });

  afterAll(() => {
    browser.close();
  });
});
