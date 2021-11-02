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
import {SingleJusticeProcedureSearchPage} from '../pageobjects/SingleJusticeProcedureSearch.page';
import { CaseNameSearchPage } from '../PageObjects/CaseNameSearch.page';
import { CaseNameSearchResultsPage } from '../PageObjects/CaseNameSearchResults.page';

const homePage = new HomePage;
let subscriptionAddPage: SubscriptionAddPage;
let searchOptionsPage: SearchOptionsPage;
let viewOptionPage: ViewOptionPage;
let alphabeticalSearchPage: AlphabeticalSearchPage;
let hearingListPage: HearingListPage;
let searchPage: SearchPage;
let subscriptionManagementPage: SubscriptionManagementPage;
let liveCaseCourtSearchControllerPage: LiveCaseCourtSearchControllerPage;
let liveCaseStatusPage: LiveCaseStatusPage;
let singleJusticeProcedureSearchPage: SingleJusticeProcedureSearchPage;
let caseNameSearchPage: CaseNameSearchPage;
let caseNameSearchResultsPage: CaseNameSearchResultsPage;

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
      expect(await liveCaseStatusPage.getPageTitle()).toEqual('Live hearing updates');
    });

    it(`should have '${validCourtName}' as a sub title`, async () => {
      expect(await liveCaseStatusPage.getCourtTitle()).toEqual('Mutsu Court');
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
      singleJusticeProcedureSearchPage = await viewOptionPage.clickContinueSingleJusticeProcedure();
      expect(await singleJusticeProcedureSearchPage.getPageTitle()).toEqual('Single Justice Procedure case');
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

    it('should open the Subscription Manage Page when a user clicks "Subscriptions" header', async () => {
      subscriptionManagementPage = await homePage.clickSubscriptionsButton();
      expect(await subscriptionManagementPage.getPageTitle()).toEqual('Your subscriptions');
    });

    it('should navigate to add subscription page on button click', async () => {
      subscriptionAddPage = await subscriptionManagementPage.clickAddNewSubscriptionButton();
      expect(await subscriptionAddPage.getPageTitle()).toBe('How do you want to add a subscription?');
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
        await caseNameSearchPage.enterText('meed');
        caseNameSearchResultsPage = await caseNameSearchPage.clickContinue();
        expect(await caseNameSearchResultsPage.getPageTitle()).toBe('Search result');
      });

      it('should display 5 results', async () => {
        expect(await caseNameSearchResultsPage.getResults()).toBe(5);
      });
    });
  });
});
