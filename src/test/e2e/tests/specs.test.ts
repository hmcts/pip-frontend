import { HomePage } from '../PageObjects/Home.page';
import { SearchOptionsPage } from '../PageObjects/SearchOptions.page';
import { AlphabeticalSearchPage } from '../PageObjects/AlphabeticalSearch.page';
import { HearingListPage } from '../PageObjects/HearingList.page';
import { SearchPage } from '../PageObjects/Search.page';
import { OtpLoginPage } from '../PageObjects/OtpLogin.page';
import { SubscriptionManagementPage } from '../PageObjects/SubscriptionManagement.page';
import { ViewOptionPage } from '../PageObjects/ViewOption.page';
import { LiveCaseCourtSearchControllerPage } from '../PageObjects/LiveCaseCourtSearchController.page';
import { LiveCaseStatusPage } from '../PageObjects/LiveCaseStatus.page';
import { OtpLoginTestingPage } from '../PageObjects/OtpLoginTesting.page';

const homePage = new HomePage;
const otpLoginPage = new OtpLoginPage();
let searchOptionsPage: SearchOptionsPage;
let viewOptionPage: ViewOptionPage;
let alphabeticalSearchPage: AlphabeticalSearchPage;
let hearingListPage: HearingListPage;
let searchPage: SearchPage;
let subscriptionManagementPage: SubscriptionManagementPage;
let liveCaseCourtSearchControllerPage: LiveCaseCourtSearchControllerPage;
let liveCaseStatusPage: LiveCaseStatusPage;
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

  it('should see both radio buttons', async () => {
    expect(await viewOptionPage.radioButtons).toBe(2);
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
      const endLetter = 'Y';
      await liveCaseCourtSearchControllerPage.selectLetter(endLetter);
      expect(await liveCaseCourtSearchControllerPage.checkIfLetterIsVisible(endLetter)).toBeTruthy();
    });

    it('selecting back to top should navigate to the top of the page', async () => {
      const startLetter = 'A';
      await liveCaseCourtSearchControllerPage.selectBackToTop();
      expect(await liveCaseCourtSearchControllerPage.checkIfLetterIsVisible(startLetter)).toBeTruthy();
    });

    it('selecting first result should take you to to the hearings list page', async () => {
      liveCaseStatusPage = await liveCaseCourtSearchControllerPage.selectFirstValidListResult();
      expect(await liveCaseStatusPage.getPageTitle()).toEqual('Live hearing updates - daily court list');
    });

    it(`should have '${validCourtName}' as a sub title`, async () => {
      expect(await liveCaseStatusPage.getCourtTitle()).toEqual('Mutsu Court');
    });

    it('should display 4 results in the table', async () => {
      expect(await liveCaseStatusPage.getResults()).toBe(4);
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
      expect(await hearingListPage.getResults()).toBe(13);
    });
  });

  describe('Following the \'search\' path', () => {
    const searchTerm = 'Abergavenny Magistrates\' Court';
    const expectedNumOfHearings = 13;


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
      hearingListPage = await searchPage.clickContinue();
      expect(await hearingListPage.getPageTitle()).toEqual('Abergavenny Magistrates\' Court hearing list');
    });

    it(`should display ${expectedNumOfHearings} results`, async () => {
      expect(await hearingListPage.getResults()).toBe(expectedNumOfHearings);
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
});
