import { HomePagePo } from '../PageObjects/HomePage.po';
import { SearchOptionPo } from '../PageObjects/SearchOption.po';
import { SearchPo } from '../PageObjects/Search.po';
import {Page, Browser} from 'puppeteer';
import {SearchResultsPo} from '../PageObjects/SearchResults.po';
import {HearingListPo} from '../PageObjects/HearingList.po';
import { AlphabeticalSearchPo } from '../PageObjects/AlphabeticalSearch.po';
import { OtpLoginPagePo } from '../PageObjects/OtpLoginPage.po';
import {SubscriptionManagementPo} from '../PageObjects/SubscriptionManagement.po';
import {AccountLockedPo} from '../PageObjects/AccountLocked.po';

const puppeteerConfig = require('../../../../jest-puppeteer.config');
const puppeteer = require('puppeteer');

const homePage = new HomePagePo;

let searchOptionPage: SearchOptionPo;
let searchPage: SearchPo;
let searchResultsPage: SearchResultsPo;
let hearingListPage: HearingListPo;
let alphabeticalSearchPage: AlphabeticalSearchPo;
let subscriptionManagementPage: SubscriptionManagementPo;
let accountLockedPage: AccountLockedPo;


const otpLoginPage = new OtpLoginPagePo;

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

  describe('Following the \'find\' path', () => {
    afterAll(async () => {
      await homePage.OpenHomePage(page);
      searchOptionPage = await homePage.ClickStartNowButton();
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

  describe('Following the \'search\' path', () => {
    const searchTerm = 'aylesbury';
    const expectedNumOfResults = 2;
    const expectedNumOfHearings = 3;
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

describe('Media User login end to subscription page', () => {
  it('should open the OTP login page', async () => {
    await otpLoginPage.OpenOtpLoginPage(page);
    expect(await otpLoginPage.getPageTitle()).toBe('Verify your email address');
  });

  it('should navigate to otp login page when incorrect passcode is entered', async () => {
    await otpLoginPage.enterText('123457');
    subscriptionManagementPage = await otpLoginPage.clickContinue();
    expect(await otpLoginPage.getPageTitle()).toContain('Verify your email address');
  });

  it('should navigate to subscription page when correct passcode is entered', async () => {
    await otpLoginPage.enterText('123456');
    subscriptionManagementPage = await otpLoginPage.clickContinue();
    expect(await subscriptionManagementPage.getPageTitle()).toContain('Subscription Management');
  });

});

describe('Media User login end to account locked page', () => {
  it('should open the OTP login page', async () => {
    await otpLoginPage.OpenOtpLoginPage(page);
    expect(await otpLoginPage.getPageTitle()).toBe('Verify your email address');
  });

  it('should navigate to otp login page when incorrect passcode is entered', async () => {
    await otpLoginPage.enterText('123457');
    subscriptionManagementPage = await otpLoginPage.clickContinue();
    expect(await otpLoginPage.getPageTitle()).toContain('Verify your email address');
  });

  it('should navigate to otp login page when incorrect passcode is entered', async () => {
    await otpLoginPage.enterText('123457');
    subscriptionManagementPage = await otpLoginPage.clickContinue();
    expect(await otpLoginPage.getPageTitle()).toContain('Verify your email address');
  });

  it('should navigate to account locked page when incorrect passcode is entered', async () => {
    await otpLoginPage.enterText('123457');
    accountLockedPage = await otpLoginPage.clickContinueToAccountLocked();
    expect(await accountLockedPage.getPageTitle()).toContain('Your account has been locked');
  });


});

describe('Media User login account locked', () => {
  it('should open the account locked page', async () => {
    await accountLockedPage.OpenAccountLockedPage(page);
    expect(await accountLockedPage.getPageTitle()).toBe('Your account has been locked');
  });

});

afterAll(() => {
  browser.close();
});
