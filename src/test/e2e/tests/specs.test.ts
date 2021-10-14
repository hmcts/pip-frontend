
import { HomePage } from '../pageobjects/Home.page';
import { SearchOptionsPage } from '../pageobjects/SearchOptions.page';
import { AlphabeticalSearchPage } from '../pageobjects/AlphabeticalSearch.page';
import { HearingListPage } from '../pageobjects/HearingList.page';
import { SearchPage } from '../pageobjects/Search.page';
import { SearchResultsPage } from '../pageobjects/SearchResults.page';
import { OtpLoginPage } from '../pageobjects/OtpLogin.page';
import { SubscriptionManagementPage } from '../pageobjects/SubscriptionManagement.page';
import { ViewOptionPage } from '../pageobjects/ViewOption.page';
import { LiveCaseCourtSearchControllerPage } from '../pageobjects/LiveCaseCourtSearchController.page';
import { LiveCaseStatusPage } from '../pageobjects/LiveCaseStatus.page';
import { OtpLoginTestingPage } from '../pageobjects/OtpLoginTesting.page';
import {SingleJusticeProcedureSearchPage} from '../pageobjects/SingleJusticeProcedureSearch.page';
import {IdamSigninPage} from '../pageobjects/IdamSignin.page';

const homePage = new HomePage;
const otpLoginPage = new OtpLoginPage();
const idamSigninPage = new IdamSigninPage;

let searchOptionsPage: SearchOptionsPage;
let viewOptionPage: ViewOptionPage;
let alphabeticalSearchPage: AlphabeticalSearchPage;
let hearingListPage: HearingListPage;
let searchPage: SearchPage;
let searchResultsPage: SearchResultsPage;
let subscriptionManagementPage: SubscriptionManagementPage;
let liveCaseCourtSearchControllerPage: LiveCaseCourtSearchControllerPage;
let liveCaseStatusPage: LiveCaseStatusPage;
let singleJusticeProcedureSearchPage: SingleJusticeProcedureSearchPage;

let otpLoginTestingPage: OtpLoginTestingPage;


describe('Finding a court or tribunal listing', () => {
  it('should open main page with "Find a court or tribunal listing title', async () => {
    await homePage.open('');
    expect(await homePage.getPageTitle()).toEqual('Find a court or tribunal hearing list');
  });

  it('should click on the "Start now button and navigate to View Options page', async () => {
    viewOptionPage = await homePage.clickStartNowButton();
    expect(await viewOptionPage.getPageTitle()).toEqual('What would you like to view?');
  });

  it('should see 3 radio buttons', async () => {
    expect(await viewOptionPage.radioButtons).toBe(3);
  });

  describe('Following the \'live case status updates\' path', () => {
    const validCourtName = 'Abergavenny Magistrates\' Court';
    after(async () => {
      await homePage.open('');
      viewOptionPage = await homePage.clickStartNowButton();
    });

    it('should select \'live hearing updates\' option and navigate to live hearings page', async () => {
      await viewOptionPage.selectLiveHearingsRadio();
      liveCaseCourtSearchControllerPage = await viewOptionPage.clickContinueForLiveHearings();
      expect(await liveCaseCourtSearchControllerPage.getPageTitle()).toEqual('Live hearing updates - select a court');
    });

    it('should select \'A\' option, and navigate to the end of the page', async () => {
      const endLetter = 'A';
      await liveCaseCourtSearchControllerPage.selectLetter(endLetter);
      expect(await liveCaseCourtSearchControllerPage.checkIfLetterIsVisible('A')).toBeTruthy();
    });

    it('selecting back to top should navigate to the top of the page', async () => {
      const startLetter = 'A';
      await liveCaseCourtSearchControllerPage.selectBackToTop();
      expect(await liveCaseCourtSearchControllerPage.checkIfLetterIsVisible(startLetter)).toBeTruthy();
    });

    it('selecting first result should take you to to the hearings list page', async () => {
      liveCaseStatusPage = await liveCaseCourtSearchControllerPage.selectFirstListResult();
      expect(await liveCaseStatusPage.getPageTitle()).toEqual('Live hearing updates - daily court list');
    });

    it(`should have '${validCourtName}' as a sub title`, async () => {
      expect(await liveCaseStatusPage.getCourtTitle()).toEqual(validCourtName);
    });

    it('should display 4 results in the table', async () => {
      expect(await liveCaseStatusPage.getResults()).toBe(4);
    });

  });

  describe('Following the \'Single Justice Procedure list\' option', () => {
    after(async () => {
      await homePage.open('');
      viewOptionPage = await homePage.clickStartNowButton();
    });

    it('should select \'Single Justice Procedure list\' option and navigate to Single Justice Procedure list page', async () => {
      await viewOptionPage.selectSingleJusticeProcedureRadio();
      singleJusticeProcedureSearchPage = await viewOptionPage.clickContinueSingleJusticeProcedure();
      expect(await singleJusticeProcedureSearchPage.getPageTitle()).toEqual('Single Justice Procedure list');
    });

  });

  describe('Following the \'tribunal hearing list\' option and \'find\' path', () => {
    after(async () => {
      await homePage.open('');
      viewOptionPage = await homePage.clickStartNowButton();
    });

    it('should select \'tribunal hearing list\' option and navigate to search option page', async () => {
      await viewOptionPage.selectSearchRadio();
      searchOptionsPage = await viewOptionPage.clickContinueForSearch();
      expect(await searchOptionsPage.getPageTitle()).toEqual('Find a court or tribunal list');
    });

    it('should select \'find\' option and navigate to alphabetical search page', async () => {
      await searchOptionsPage.selectFindRadio();
      alphabeticalSearchPage = await searchOptionsPage.clickContinueForAlphabetical();
      expect(await alphabeticalSearchPage.getPageTitle()).toEqual('Find a court or tribunal listing');
    });

    it('should select \'T\' option, and navigate to the end of the page', async() => {
      const endLetter = 'T';
      await alphabeticalSearchPage.selectLetter(endLetter);
      expect(await alphabeticalSearchPage.checkIfLetterIsVisible('T')).toBeTruthy();
    });

    it('selecting back to top should navigate to the top of the page', async () => {
      const startLetter = 'A';
      await alphabeticalSearchPage.selectBackToTop();
      expect(await alphabeticalSearchPage.checkIfLetterIsVisible(startLetter)).toBeTruthy();
    });

    it('selecting first result should take you to to the hearings list page', async () => {
      hearingListPage = await alphabeticalSearchPage.selectFirstListResult();
      expect(await hearingListPage.getPageTitle()).toEqual('Abergavenny Magistrates\' Court hearing list');
    });

    it('should display 3 result', async() => {
      expect(await hearingListPage.getResults()).toBe(3);
    });
  });

  describe('Following the \'search\' path', () => {
    const searchTerm = 'abergavenny';
    const expectedNumOfResults = 1;
    const expectedNumOfHearings = 1;


    it('should select \'tribunal hearing list\' option and navigate to search option page', async () => {
      await viewOptionPage.selectSearchRadio();
      searchOptionsPage = await viewOptionPage.clickContinueForSearch();
      expect(await searchOptionsPage.getPageTitle()).toEqual('Find a court or tribunal list');
    });

    it('should select \'search\' option and navigate to search page', async () => {
      await searchOptionsPage.selectSearchRadio();
      searchPage = await searchOptionsPage.clickContinueForSearch();
      expect(await searchPage.getPageTitle()).toEqual('What court or tribunal are you interested in?');
    });

    it('should enter text and click continue', async () => {
      await searchPage.enterText(searchTerm);
      searchResultsPage = await searchPage.clickContinue();
      expect(await searchResultsPage.getPageTitle()).toEqual(`Courts or tribunals in ${searchTerm}`);
    });

    it(`should display ${expectedNumOfResults} results`, async() => {
      expect(await searchResultsPage.getResults()).toBe(1);
    });

    it('should navigate to hearing list page', async () => {
      hearingListPage = await searchResultsPage.selectCourt();
      expect(await hearingListPage.getPageTitle()).toEqual('Abergavenny Magistrates\' Court hearing list');
    });

    it(`should display ${expectedNumOfHearings} results`, async () => {
      expect(await hearingListPage.getResults()).toBe(3);
    });
  });

  describe('Media User Login', () => {
    it('should open the OTP login page when a user clicks "Subscriptions" header', async () => {
      otpLoginTestingPage = await homePage.clickSubscriptionsButton();
      expect(await otpLoginTestingPage.getPageTitle()).toEqual('Enter your email address');
    });

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

  describe('Idam SignIn selection', () => {

    it('should open Idam SignIn page with Sign in to your account', async () => {
      await idamSigninPage.open('idam-signin');
      expect(await idamSigninPage.getPageTitle()).toEqual('Sign in to your account');
    });

    it('selecting crime and redirect to external url', async () => {
      const valueToSelect = 'Crime';
      await idamSigninPage.selectIdam(valueToSelect);
      expect(await idamSigninPage.clickContinue()).toBeTruthy();
    });

  });
});
