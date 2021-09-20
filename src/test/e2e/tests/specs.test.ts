import { HomePage } from '../pageobjects/Home.page';
import { SearchOptionsPage } from '../pageobjects/SearchOptions.page';
import { AlphabeticalSearchPage } from '../pageobjects/AlphabeticalSearch.page';
import { HearingListPage } from '../pageobjects/HearingList.page';
import { SearchPage } from '../pageobjects/Search.page';
import { SearchResultsPage } from '../pageobjects/SearchResults.page';
import { OtpLoginPage } from '../pageobjects/OtpLogin.page';
import { SubscriptionManagementPage } from '../pageobjects/SubscriptionManagement.page';
import { ViewOptionPage } from '../PageObjects/ViewOption.page';
import { LiveCaseCourtSearchControllerPage } from '../PageObjects/LiveCaseCourtSearchController.page';

const homePage = new HomePage;
const otpLoginPage = new OtpLoginPage();
let searchOptionsPage: SearchOptionsPage;
let viewOptionPage: ViewOptionPage;
let alphabeticalSearchPage: AlphabeticalSearchPage;
let hearingListPage: HearingListPage;
let searchPage: SearchPage;
let searchResultsPage: SearchResultsPage;
let subscriptionManagementPage: SubscriptionManagementPage;
let liveCaseCourtSearchControllerPage: LiveCaseCourtSearchControllerPage;

describe('Finding a court or tribunal listing', () => {
  it('should open main page with "Find a court or tribunal listing title', async () => {
    await homePage.open('');
    expect(await homePage.getPageTitle()).toEqual('Find a court or tribunal listing');
  });

  it('should click on the "Start now button and navigate to View Options page', async () => {
    viewOptionPage = await homePage.clickStartNowButton();
    expect(await viewOptionPage.getPageTitle()).toEqual('What would you like to view?');
  });

  it('should see both radio buttons', async () => {
    expect(await viewOptionPage.radioButtons).toBe(2);
  });

  describe('Following the \'live case status updates\' path', () => {
    after(async () => {
      await homePage.open('');
      viewOptionPage = await homePage.clickStartNowButton();
    });

    it('should select \'live hearing updates\' option and navigate to live hearings page', async () => {
      await viewOptionPage.selectLiveHearingsRadio();
      liveCaseCourtSearchControllerPage = await viewOptionPage.clickContinueForLiveHearings();
      expect(await liveCaseCourtSearchControllerPage.getPageTitle()).toEqual('Live hearings updates - select a court');
    });

    it('should select \'Z\' option, and navigate to the end of the page', async () => {
      const endLetter = 'Z';
      await liveCaseCourtSearchControllerPage.selectLetter(endLetter);
      expect(await liveCaseCourtSearchControllerPage.checkIfLetterIsVisible('Z')).toBeTruthy();
    });

    it('selecting back to top should navigate to the top of the page', async () => {
      const startLetter = 'A';
      await liveCaseCourtSearchControllerPage.selectBackToTop();
      expect(await liveCaseCourtSearchControllerPage.checkIfLetterIsVisible(startLetter)).toBeTruthy();
    });
  });

  describe('Following the \'tribunal hearing list\' option and \'find\' path', () => {
    after(async () => {
      await homePage.open('');
      viewOptionPage = await homePage.clickStartNowButton();
    });

    it('should select \'tribunal hearing list\' option and navigate to search option page', async() => {
      await viewOptionPage.selectSearchRadio();
      searchOptionsPage = await viewOptionPage.clickContinueForSearch();
    });

    it('should select \'find\' option and navigate to alphabetical search page', async() => {
      await searchOptionsPage.selectFindRadio();
      alphabeticalSearchPage = await searchOptionsPage.clickContinueForAlphabetical();
      expect(await alphabeticalSearchPage.getPageTitle()).toEqual('Find a court or tribunal listing');
    });

    it('should select \'Z\' option, and navigate to the end of the page', async() => {
      const endLetter = 'Z';
      await alphabeticalSearchPage.selectLetter(endLetter);
      expect(await alphabeticalSearchPage.checkIfLetterIsVisible('Z')).toBeTruthy();
    });

    it('selecting back to top should navigate to the top of the page', async() => {
      const startLetter = 'A';
      await alphabeticalSearchPage.selectBackToTop();
      expect(await alphabeticalSearchPage.checkIfLetterIsVisible(startLetter)).toBeTruthy();
    });

    it('selecting first result should take you to to the hearings list page', async() => {
      hearingListPage = await alphabeticalSearchPage.selectFirstListResult();
      expect(await hearingListPage.getPageTitle()).toEqual('Albertville Court hearing list');
    });

    it('should display 1 result', async() => {
      expect(await hearingListPage.getResults()).toBe(1);
    });
  });

  describe('Following the \'tribunal hearing list\' and \'search\' path', () => {
    const searchTerm = 'aylesbury';
    const expectedNumOfResults = 2;
    const expectedNumOfHearings = 3;

    it('should select \'search\' option and navigate to search page', async() => {
      await searchOptionsPage.selectSearchRadio();
      searchPage = await searchOptionsPage.clickContinueForSearch();
      expect(await searchPage.getPageTitle()).toEqual('What court or tribunal are you interested in?');
    });

    it('should enter text and click continue', async() => {
      await searchPage.enterText(searchTerm);
      searchResultsPage = await searchPage.clickContinue();
      expect(await searchResultsPage.getPageTitle()).toEqual(`Courts or tribunals in ${searchTerm}`);
    });

    it(`should display ${expectedNumOfResults} results`, async() => {
      expect(await searchResultsPage.getResults()).toBe(2);
    });

    it('should navigate to hearing list page', async() => {
      hearingListPage = await searchResultsPage.selectCourt();
      expect(await hearingListPage.getPageTitle()).toEqual('Aylesbury Crown Court hearing list');
    });

    it(`should display ${expectedNumOfHearings} results`, async() => {
      expect(await hearingListPage.getResults()).toBe(3);
    });
  });

  describe('Media User Login', () => {
    it('should open the OTP login page', async () => {
      await otpLoginPage.open('otp-login');
      expect(await otpLoginPage.getPageTitle()).toBe('Verify your email address');
    });

    it('should navigate to subscription page when correct passcode is entered', async () => {
      await otpLoginPage.enterText('222222');
      subscriptionManagementPage = await otpLoginPage.clickContinue();
      expect(await subscriptionManagementPage.getPageTitle()).toEqual('Subscription Management');
    });
  });
});

