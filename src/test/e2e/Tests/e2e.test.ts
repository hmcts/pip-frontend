import { HomePagePo } from '../PageObjects/HomePage.po';
import { SearchOptionPo } from '../PageObjects/SearchOption.po';
import { SearchPo } from '../PageObjects/Search.po';
import { Page, Browser } from 'puppeteer';
import { SearchResultsPo } from '../PageObjects/SearchResults.po';
import { HearingListPo } from '../PageObjects/HearingList.po';
import { AlphabeticalSearchPo } from '../PageObjects/AlphabeticalSearch.po';
import { OtpLoginPagePo } from '../PageObjects/OtpLoginPage.po';
import { SubscriptionManagementPo } from '../PageObjects/SubscriptionManagement.po';
import { ViewOptionPo } from '../PageObjects/ViewOption.po';
import { LiveCasePo } from '../PageObjects/LiveCase.po';

const puppeteerConfig = require('../../../../jest-puppeteer.config');
const puppeteer = require('puppeteer');

const homePage = new HomePagePo;

let viewOptionPage: ViewOptionPo;
let searchOptionPage: SearchOptionPo;
let liveHearingsOptionPage: LiveCasePo;
let searchPage: SearchPo;
let searchResultsPage: SearchResultsPo;
let hearingListPage: HearingListPo;
let alphabeticalSearchPage: AlphabeticalSearchPo;
let subscriptionManagementPage: SubscriptionManagementPo;

const otpLoginPage = new OtpLoginPagePo;

let page: Page;
let browser: Browser;

beforeAll(async () => {
  browser = await puppeteer.launch(puppeteerConfig.launch);
  page = await browser.newPage();
});

describe('Finding a court or tribunal listing', () => {
  it('should open main page with "Find a court or tribunal hearing list" title', async () => {
    await homePage.OpenHomePage(page);
    expect(await homePage.getPageTitle()).toBe('Find a court or tribunal hearing list');
  });

  it('should click on the "Start now" button and navigate to View Options page', async () => {
    viewOptionPage = await homePage.ClickStartNowButton();
    expect(await viewOptionPage.getPageTitle()).toContain('What would you like to view?');
  });

  it('should see both radio buttons', async () => {
    expect(await viewOptionPage.getRadioButtons()).toBe(2);
  });

  describe('Following the \'live case status updates\' path', () => {
    afterAll(async () => {
      await homePage.OpenHomePage(page);
      viewOptionPage = await homePage.ClickStartNowButton();
    });

    it('should select \'live hearing updates\' option and navigate to live hearings page', async() => {
      await viewOptionPage.selectLiveHearingsRadio();
      liveHearingsOptionPage = await viewOptionPage.clickContinueForLiveHearings();
      expect(await liveHearingsOptionPage.getPageTitle()).toContain('Live hearings updates - select a court');
    });

    it('should select \'Z\' option, and navigate to the end of the page', async () => {
      const endLetter = 'Z';
      liveHearingsOptionPage = await liveHearingsOptionPage.selectLetter(endLetter);
      expect(await liveHearingsOptionPage.checkIfLetterIsVisible(endLetter)).toBeTruthy();
    });

    it('selecting back to top should navigate to the top of the page', async() => {
      const startLetter = 'A';
      liveHearingsOptionPage = await liveHearingsOptionPage.selectBackToTop();
      expect(await liveHearingsOptionPage.checkIfLetterIsVisible(startLetter)).toBeTruthy();
    });
  });

  describe('Following the \'tribunal hearing list \' and \'find\' path', () => {
    afterAll(async () => {
      await homePage.OpenHomePage(page);
      viewOptionPage = await homePage.ClickStartNowButton();
    });

    it('should select \'tribunal hearing list\' option and navigate to search option page', async() => {
      await viewOptionPage.selectSearchRadio();
      searchOptionPage = await viewOptionPage.clickContinueForSearch();
    });

    it('should select \'find\' option and navigate to alphabetical search page', async() => {
      await searchOptionPage.selectFindRadio();
      alphabeticalSearchPage = await searchOptionPage.clickContinueForAlphabetical();
      expect(await alphabeticalSearchPage.getPageTitle()).toContain('Find a court or tribunal listing');
    });

    it('should select \'Z\' option, and navigate to the end of the page', async() => {
      const endLetter = 'Z';
      alphabeticalSearchPage = await alphabeticalSearchPage.selectLetter(endLetter);
      expect(await alphabeticalSearchPage.checkIfLetterIsVisible(endLetter)).toBeTruthy();
    });

    it('selecting back to top should navigate to the top of the page', async() => {
      const startLetter = 'A';
      alphabeticalSearchPage = await alphabeticalSearchPage.selectBackToTop();
      expect(await alphabeticalSearchPage.checkIfLetterIsVisible(startLetter)).toBeTruthy();
    });

    it('selecting first result should take you to to the hearings list page', async() => {
      hearingListPage = await alphabeticalSearchPage.selectFirstListResult();
      expect(await hearingListPage.getPageTitle()).toContain('Albertville Court hearing list');
    });

    it('should display 1 result', async() => {
      expect(await hearingListPage.getResults()).toBe(1);
    });
  });

  describe('Following the \'tribunal hearing list\' and \'search\' path', () => {
    const searchTerm = 'aylesbury';
    const expectedNumOfResults = 2;
    const expectedNumOfHearings = 3;

    it('should select \'tribunal hearing list\' option and navigate to search option page', async() => {
      await viewOptionPage.selectSearchRadio();
      searchOptionPage = await viewOptionPage.clickContinueForSearch();
      expect(await searchOptionPage.getPageTitle()).toContain('Find a court or tribunal list');
    });

    it('should select \'search\' option and navigate to search page', async() => {
      await searchOptionPage.selectSearchRadio();
      searchPage = await searchOptionPage.clickContinueForSearch();
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

    it(`should display ${expectedNumOfHearings} results`, async() => {
      expect(await hearingListPage.getResults()).toBe(3);
    });
  });
});

describe('Media User login', () => {
  it('should open the OTP login page', async () => {
    await otpLoginPage.OpenOtpLoginPage(page);
    expect(await otpLoginPage.getPageTitle()).toBe('Verify your email address');
  });

  it('should navigate to subscription page when correct passcode is entered', async () => {
    await otpLoginPage.enterText('222222');
    subscriptionManagementPage = await otpLoginPage.clickContinue();
    expect(await subscriptionManagementPage.getPageTitle()).toContain('Subscription Management');
  });
});

afterAll(() => {
  browser.close();
});
