import { HomePage } from '../pageobjects/Home.page';
import { SearchOptionsPage } from '../pageobjects/SearchOptions.page';
import { AlphabeticalSearchPage } from '../pageobjects/AlphabeticalSearch.page';
import { HearingListPage } from '../pageobjects/HearingList.page';
import { SearchPage } from '../pageobjects/Search.page';
import { SubscriptionManagementPage } from '../pageobjects/SubscriptionManagement.page';
import { ViewOptionPage } from '../pageobjects/ViewOption.page';
import { LiveCaseCourtSearchControllerPage } from '../pageobjects/LiveCaseCourtSearchController.page';
import { SubscriptionAddPage } from '../pageobjects/SubscriptionAdd.page';
import { LiveCaseStatusPage } from '../pageobjects/LiveCaseStatus.page';
import { CaseNameSearchPage } from '../PageObjects/CaseNameSearch.page';
import { CaseNameSearchResultsPage } from '../PageObjects/CaseNameSearchResults.page';
import { SubscriptionUrnSearchResultsPage } from '../PageObjects/SubscriptionUrnSearchResults.page';
import { SubscriptionUrnSearchPage } from '../PageObjects/SubscriptionUrnSearch.page';
import { CourtNameSearchPage } from '../PageObjects/CourtNameSearch.page';
import { MockSessionPage } from '../PageObjects/MockSession.page';
import { SingleJusticeProcedurePage } from '../PageObjects/SingleJusticeProcedure.page';
import {SubscriptionConfirmationPage} from '../PageObjects/SubscriptionConfirmation.page';
import {SubscriptionConfirmedPage} from '../PageObjects/SubscriptionConfirmed.page';

const homePage = new HomePage;
const subscriptionAddPage = new SubscriptionAddPage;
const mockSessionPage = new MockSessionPage();
let searchOptionsPage: SearchOptionsPage;
let viewOptionPage: ViewOptionPage;
let alphabeticalSearchPage: AlphabeticalSearchPage;
let hearingListPage: HearingListPage;
let searchPage: SearchPage;
let subscriptionManagementPage: SubscriptionManagementPage;
let liveCaseCourtSearchControllerPage: LiveCaseCourtSearchControllerPage;
let liveCaseStatusPage: LiveCaseStatusPage;
let singleJusticeProcedurePage: SingleJusticeProcedurePage;
let caseNameSearchPage: CaseNameSearchPage;
let caseNameSearchResultsPage: CaseNameSearchResultsPage;
let subscriptionUrnSearchResultsPage: SubscriptionUrnSearchResultsPage;
let subscriptionUrnSearchPage: SubscriptionUrnSearchPage;
let courtNameSearchPage: CourtNameSearchPage;
let subscriptionConfirmationPage: SubscriptionConfirmationPage;
let subscriptionConfirmedPage: SubscriptionConfirmedPage;

describe('Finding a court or tribunal listing', () => {
  it('should open main page with "See publications and information from a court or tribunal title', async () => {
    await homePage.open('');
    expect(await homePage.getPageTitle()).toEqual('See publications and information from a court or tribunal');
  });

  it('should click on the "Start now button and navigate to View Options page', async () => {
    viewOptionPage = await homePage.clickStartNowButton();
    expect(await viewOptionPage.getPageTitle()).toEqual('What would you like to view?');
  });

  it('should see 3 radio buttons', async () => {
    expect(await viewOptionPage.radioButtons).toBe(3);
  });

  describe('Following the \'live case status updates\' path', () => {
    const validCourtName = 'Birmingham Crown Court';
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
      expect(await liveCaseStatusPage.getPageTitle()).toEqual('Live hearing updates');
    });

    it(`should have '${validCourtName}' as a sub title`, async () => {
      expect(await liveCaseStatusPage.getCourtTitle()).toEqual('Birmingham Crown Court');
    });

    it('should display 4 results in the table', async () => {
      expect(await liveCaseStatusPage.getResults()).toBe(4);
    });

  });

  describe('Following the \'Single Justice Procedure case\' option', () => {
    after(async () => {
      await homePage.open('');
      viewOptionPage = await homePage.clickStartNowButton();
    });

    before(async () => {
      await homePage.open('');
      viewOptionPage = await homePage.clickStartNowButton();
    });

    it('should select \'Single Justice Procedure case\' option and navigate to Single Justice Procedure case page', async () => {
      await viewOptionPage.selectSingleJusticeProcedureRadio();
      singleJusticeProcedurePage = await viewOptionPage.clickContinueSingleJusticeProcedure();
      expect(await singleJusticeProcedurePage.getPageTitle()).toEqual('Single Justice Procedure cases');
    });

  });

  describe('Following the \'Court or Tribunal hearing Publications\' option and \'no name\' path', () => {
    after(async () => {
      await homePage.open('');
      viewOptionPage = await homePage.clickStartNowButton();
    });

    it('should select \'Court or Tribunal hearing Publications\' option and navigate to search option page', async () => {
      await viewOptionPage.selectSearchRadio();
      searchOptionsPage = await viewOptionPage.clickContinueForSearch();
      expect(await searchOptionsPage.getPageTitle()).toEqual('Do you know the name of the court or tribunal?');
    });

    it('should select \'I do not have the name\' option and navigate to alphabetical search page', async () => {
      await searchOptionsPage.selectDontHaveTheNameRadio();
      alphabeticalSearchPage = await searchOptionsPage.clickContinueForAlphabetical();
      expect(await alphabeticalSearchPage.getPageTitle()).toEqual('Find a court or tribunal');
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
      hearingListPage = await alphabeticalSearchPage.selectSecondListResult();
      expect(await hearingListPage.getPageTitle()).toEqual('Aberystwyth Justice Centre hearing list');
    });

    it('should display 0 results', async() => {
      expect(await hearingListPage.getResults()).toBe(0);
    });
  });

  describe('Following the \'search\' path', () => {
    const searchTerm = 'Aberdeen Tribunal Hearing Centre';
    const expectedNumOfHearings = 0;


    it('should select \'tribunal hearing list\' option and navigate to search option page', async () => {
      await viewOptionPage.selectSearchRadio();
      searchOptionsPage = await viewOptionPage.clickContinueForSearch();
      expect(await searchOptionsPage.getPageTitle()).toEqual('Do you know the name of the court or tribunal?');
    });

    it('should select \'have the name\' option and navigate to search page', async () => {
      await searchOptionsPage.selectHaveTheNameRadio();
      searchPage = await searchOptionsPage.clickContinueForSearch();
      expect(await searchPage.getPageTitle()).toEqual('What court or tribunal are you interested in?');
    });

    it('should enter text and click continue', async () => {
      await searchPage.enterText(searchTerm);
      hearingListPage = await searchPage.clickContinue();
      expect(await hearingListPage.getPageTitle()).toEqual('Summary of publications for Aberdeen Tribunal Hearing Centre');
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

    it('should open Session Mock Page to authenticate user', async () => {
      await mockSessionPage.open('/mock-session');
      expect(await mockSessionPage.getPageTitle()).toBe('Mock User Session Data');
    });

    it('should fill session form open subscription management page', async () => {
      await mockSessionPage.enterText('Joe Bloggs', 'UsernameInput');
      await mockSessionPage.enterText('1', 'UserIdInput');
      await mockSessionPage.selectOption('UserType');
      subscriptionManagementPage = await mockSessionPage.clickContinue();
      expect(await subscriptionManagementPage.getPageTitle()).toBe('Your subscriptions');
    });

    it('should open the Subscription Manage Page when a user clicks Subscriptions', async () => {
      await subscriptionAddPage.open('subscription-add');
      expect(await subscriptionAddPage.getPageTitle()).toEqual('How do you want to add a subscription?');
    });

    describe('Following case name search path', () => {
      it('should open case name search path', async () => {
        await subscriptionAddPage.selectOption('SubscriptionAddByCaseName');
        caseNameSearchPage = await subscriptionAddPage.clickContinueForCaseName();
        expect(await caseNameSearchPage.getPageTitle()).toBe('Enter a case name');
      });

      it('should display error dialog for a invalid case name', async () => {
        await caseNameSearchPage.enterText('foo');
        caseNameSearchPage = await caseNameSearchPage.clickContinueWithInvalidInput();
        expect(await caseNameSearchPage.getErrorSummaryTitle()).toBe('There is a problem');
      });

      it('should search for a valid case name and navigate to results page', async () => {
        await caseNameSearchPage.enterText('Ashely');
        caseNameSearchResultsPage = await caseNameSearchPage.clickContinue();
        expect(await caseNameSearchResultsPage.getPageTitle()).toBe('Search result');
      });

      it('should display 1 results', async () => {
        expect(await caseNameSearchResultsPage.getResults()).toBe(1);
      });
    });

    describe('Following urn search path', () => {
      const validSearchTerm = 'N363N6R4OG';
      const invalidSearchTerm = '123456';
      const expectedNumOfResults = 1;

      before(async () => {
        await subscriptionAddPage.open('subscription-add');
      });

      it('should select \'By unique reference number\' option and navigate to search urn page', async () => {
        await subscriptionAddPage.selectOption('SubscriptionAddByUniqueRefNumber');
        subscriptionUrnSearchPage = await subscriptionAddPage.clickContinueForUrnSearch();
        expect(await subscriptionUrnSearchPage.getPageTitle()).toEqual('What is the unique reference number (URN)?');
      });

      it('should enter invalid text and click continue', async () => {
        await subscriptionUrnSearchPage.enterText(invalidSearchTerm);
        await subscriptionUrnSearchPage.clickContinue();
        expect(await subscriptionUrnSearchPage.getPageTitle()).toEqual('What is the unique reference number (URN)?');
      });

      it('should enter text and click continue', async () => {
        await subscriptionUrnSearchPage.enterText(validSearchTerm);
        subscriptionUrnSearchResultsPage =  await subscriptionUrnSearchPage.clickContinue();
        expect(await subscriptionUrnSearchResultsPage.getPageTitle()).toEqual('Search result');
      });

      it(`should display ${expectedNumOfResults} results`, async() => {
        expect(await subscriptionUrnSearchResultsPage.getResults()).toBe(1);
      });

      it('should click continue', async () => {
        subscriptionConfirmationPage =  await subscriptionUrnSearchResultsPage.clickContinue();
        expect(await subscriptionConfirmationPage.getPageTitle()).toEqual('Confirm your subscriptions');
      });

      it('should click continue', async () => {
        subscriptionConfirmedPage =  await subscriptionConfirmationPage.clickContinue();
        expect(await subscriptionConfirmedPage.getPageTitle()).toEqual('Search result');
      });

    });

    describe('Following court or tribunal search path', () => {
      const allCourts = 304;
      const crownCourts = 48;

      before(async () => {
        await subscriptionAddPage.open('subscription-add');
      });

      it('should open court or tribunal name search page', async () => {
        await subscriptionAddPage.selectOption('SubscriptionAddByCourtOrTribunal');
        courtNameSearchPage = await subscriptionAddPage.clickContinueForCourtOrTribunal();

        expect(await courtNameSearchPage.getPageTitle()).toBe('Subscribe by court or tribunal name');
      });

      it(`should display ${allCourts} results`, async() => {
        expect(await courtNameSearchPage.getResults()).toBe(allCourts);
      });

      it('should select \'Y\' option and navigate to the end of the page', async () => {
        const endLetter = 'Y';
        await courtNameSearchPage.selectLetter(endLetter);
        expect(await courtNameSearchPage.checkIfLetterIsVisible('Y')).toBeTruthy();
      });

      it('should select first jurisdiction filter', async () => {
        await courtNameSearchPage.selectJurisdictionFilter();
        expect(await courtNameSearchPage.jurisdictionChecked()).toBeTruthy();
      });

      it('should click on the apply filters button', async () => {
        courtNameSearchPage = await courtNameSearchPage.clickApplyFiltersButton();
        expect(await courtNameSearchPage.getPageTitle()).toBe('Subscribe by court or tribunal name');
      });

      it(`should display ${crownCourts} results (Crown Courts) filter`, async() => {
        expect(await courtNameSearchPage.getResults()).toBe(crownCourts);
      });

      it('should click clear filters button', async () => {
        courtNameSearchPage = await courtNameSearchPage.clickClearFiltersButton();
        expect(await courtNameSearchPage.getPageTitle()).toBe('Subscribe by court or tribunal name');
      });

      it(`should display ${allCourts} results`, async() => {
        expect(await courtNameSearchPage.getResults()).toBe(allCourts);
      });
    });
  });
});
