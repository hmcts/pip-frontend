import { HomePagePo } from '../PageObjects/HomePage.po';
import { SearchOptionPo } from '../PageObjects/SearchOption.po';
import { SearchPo } from '../PageObjects/Search.po';
import {Page, Browser} from 'puppeteer';
import {SearchResultsPo} from '../PageObjects/SearchResults.po';
import {HearingListPo} from '../PageObjects/HearingList.po';

const puppeteerConfig = require('../../../../jest-puppeteer.config');
const puppeteer = require('puppeteer');

const homePage = new HomePagePo;

let searchOptionPage: SearchOptionPo;
let searchPage: SearchPo;
let searchResultsPage: SearchResultsPo;
let hearingListPage: HearingListPo;

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

  describe('Following the \'search\' path', () => {
    const searchTerm = 'aylesbury';
    const expectedNumOfResults = 2;
    const expectedNumOfhearings = 3;
    it('should select \'search\' option and navigate to search page', async() => {
      await searchOptionPage.selectSearchRadio();
      searchPage = await searchOptionPage.clickContinue();
      expect(await searchPage.getPageTitle()).toContain('What court or tribunal are you interested in?');
    });

    it('should enter text and click continue', async() => {
      await searchPage.enterText(searchTerm);
      searchResultsPage = await searchPage.clickContinue();
      expect(await searchResultsPage.getPageTitle()).toContain(`Courts or tribunals in ${searchTerm}`);
    });

    it(`should display ${expectedNumOfResults} results`, async() => {
      expect(await searchResultsPage.getResults()).toBe(2);
    });

    it('should navigate to hearing list page', async() => {
      hearingListPage = await searchResultsPage.selectCourt();
      expect(await hearingListPage.getPageTitle()).toContain('Aylesbury Crown Court hearing list');
    });

    it(`should display ${expectedNumOfhearings} results`, async() => {
      expect(await hearingListPage.getResults()).toBe(3);
    });
  });
});

afterAll(() => {
  browser.close();
});
