import { HomePage } from '../pageobjects/Home.page';
import { SearchOptionsPage } from '../pageobjects/SearchOptions.page';
import { AlphabeticalSearchPage } from '../pageobjects/AlphabeticalSearch.page';
import { HearingListPage } from '../pageobjects/HearingList.page';
import { SearchPage } from '../pageobjects/Search.page';
import { OtpLoginPage } from '../pageobjects/OtpLogin.page';
import { SubscriptionManagementPage } from '../pageobjects/SubscriptionManagement.page';
import { ViewOptionPage } from '../pageobjects/ViewOption.page';
import { LiveCaseCourtSearchControllerPage } from '../pageobjects/LiveCaseCourtSearchController.page';
import { SubscriptionAddPage } from '../pageobjects/SubscriptionAdd.page';
import { LiveCaseStatusPage } from '../pageobjects/LiveCaseStatus.page';
import { SubscriptionUrnSearchResultsPage} from '../pageobjects/SubscriptionUrnSearchResults.page';
import { SubscriptionUrnSearchPage} from '../pageobjects/SubscriptionUrnSearch.page';
import { SingleJusticeProcedureSearchPage } from '../pageobjects/SingleJusticeProcedureSearch.page';



const homePage = new HomePage;
const subscriptionAddPage = new SubscriptionAddPage();
let searchOptionsPage: SearchOptionsPage;
let viewOptionPage: ViewOptionPage;
let alphabeticalSearchPage: AlphabeticalSearchPage;
let hearingListPage: HearingListPage;
let searchPage: SearchPage;
let subscriptionManagementPage: SubscriptionManagementPage;
let liveCaseCourtSearchControllerPage: LiveCaseCourtSearchControllerPage;
let liveCaseStatusPage: LiveCaseStatusPage;
let subscriptionUrnSearchResultsPage: SubscriptionUrnSearchResultsPage;
let subscriptionUrnSearchPage: SubscriptionUrnSearchPage;
let singleJusticeProcedureSearchPage: SingleJusticeProcedureSearchPage;
let otpLoginPage: OtpLoginPage;


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

    it('should select \'Y\' option, and navigate to the end of the page', async () => {
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

  describe('Following the \'Single Justice Procedure list\' option', () => {
    after(async () => {
      await homePage.open('');
      viewOptionPage = await homePage.clickStartNowButton();
    });

    before(async () => {
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
      expect(await searchOptionsPage.getPageTitle()).toEqual('Do you know the name of the court or tribunal?');
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

    it('should display 13 results', async() => {
      expect(await hearingListPage.getResults()).toBe(13);
    });
  });

  describe('Following the \'search\' path', () => {
    const searchTerm = 'Abergavenny Magistrates\' Court';
    const expectedNumOfHearings = 13;

    it('should select \'tribunal hearing list\' option and navigate to search option page', async () => {
      await viewOptionPage.selectSearchRadio();
      searchOptionsPage = await viewOptionPage.clickContinueForSearch();
      expect(await searchOptionsPage.getPageTitle()).toEqual('Do you know the name of the court or tribunal?');
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
    after(async () => {
      await homePage.open('');
      viewOptionPage = await homePage.clickStartNowButton();
    });
    it('should open the OTP login page when a user clicks "Subscriptions" header', async () => {
      otpLoginPage = await homePage.clickSubscriptionsButton();
      expect(await otpLoginPage.getPageTitle()).toEqual('Verify your email address');
    });

    it('should navigate to subscription page when correct passcode is entered', async () => {
      await otpLoginPage.enterText('222222');
      subscriptionManagementPage = await otpLoginPage.clickContinue();
      expect(await subscriptionManagementPage.getPageTitle()).toEqual('Your subscriptions');
    });
  });

  describe('Add a subscription path', () => {
    const validSearchTerm = '12345678';
    const invalidSearchTerm = '123456';
    const expectedNumOfResults = 1;

    it('should open the subscription add page', async () => {
      await subscriptionAddPage.open('subscription-add');
      expect(await subscriptionAddPage.getPageTitle()).toBe('How do you want to add a subscription?');
    });

    it('should see 4 radio buttons', async () => {
      expect(await subscriptionAddPage.radioButtons).toBe(4);
    });

    it('should select \'By unique reference number\' option and navigate to search urn page', async () => {
      await subscriptionAddPage.selectUrnSearchRadio();
      subscriptionUrnSearchPage = await subscriptionAddPage.clickContinueForUrnSearch();
      expect(await subscriptionUrnSearchPage.getPageTitle()).toEqual('Enter a unique reference number');
    });

    it('should enter invalid text and click continue', async () => {
      await subscriptionUrnSearchPage.enterText(invalidSearchTerm);
      await subscriptionUrnSearchPage.clickContinue();
      expect(await subscriptionUrnSearchPage.getPageTitle()).toEqual('Enter a unique reference number');
    });

    it('should enter text and click continue', async () => {
      await subscriptionUrnSearchPage.enterText(validSearchTerm);
      subscriptionUrnSearchResultsPage =  await subscriptionUrnSearchPage.clickContinue();
      expect(await subscriptionUrnSearchResultsPage.getPageTitle()).toEqual('Search result');
    });

    it(`should display ${expectedNumOfResults} results`, async() => {
      expect(await subscriptionUrnSearchResultsPage.getResults()).toBe(1);
    });
  });
});
