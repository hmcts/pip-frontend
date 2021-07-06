import { HomePagePo } from '../PageObjects/HomePage.po';
import { SearchOptionPo } from '../PageObjects/SearchOption.po';
import {Page, Browser} from 'puppeteer';

const puppeteerConfig = require('../../../../jest-puppeteer.config');
const puppeteer = require('puppeteer');

const homePage = new HomePagePo;

let searchOptionPage: SearchOptionPo;

let page: Page;
let browser: Browser;

beforeAll(async () => {
  browser = await puppeteer.launch(puppeteerConfig.launch);
  page = await browser.newPage();
});

describe('Finding a court or tribunal listing', () => {
  it('should open main page with "Find a court or tribunal listing" title', async () => {
    await homePage.OpenHomePage(page);
    expect(await homePage.getPageTitle()).toBe('Find a court or tribunal listing');
  });

  it('should click on the "Start now" button and navigate to Search Options page', async () => {
    searchOptionPage = await homePage.ClickStartNowButton();
    expect(await searchOptionPage.getPageTitle()).toContain('Find a court or tribunal list');
  });

  it('should see both radio buttons', async () => {
    expect(await searchOptionPage.getRadioButtons()).toBe(2);
  });
});

afterAll(() => {
  browser.close();
});
