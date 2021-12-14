console.log(__dirname);

const fs = require('fs');

console.log(fs.readdirSync(__dirname));
console.log(fs.readdirSync(__dirname + '/..'));
console.log(fs.readdirSync(__dirname + '/../PageObjects'));
console.log(fs.readdirSync(__dirname + '/../pageobjects'));

import { HomePage } from '../PageObjects/Home.page';
import { SearchOptionsPage } from '../PageObjects/SearchOptions.page';
import { AlphabeticalSearchPage } from '../PageObjects/AlphabeticalSearch.page';
import { HearingListPage } from '../PageObjects/HearingList.page';
import { SearchPage } from '../PageObjects/Search.page';
import { SubscriptionManagementPage } from '../PageObjects/SubscriptionManagement.page';
import { ViewOptionPage } from '../PageObjects/ViewOption.page';
import { LiveCaseCourtSearchControllerPage } from '../PageObjects/LiveCaseCourtSearchController.page';
import { SubscriptionAddPage } from '../PageObjects/SubscriptionAdd.page';
import { LiveCaseStatusPage } from '../PageObjects/LiveCaseStatus.page';
import { CaseNameSearchPage } from '../PageObjects/CaseNameSearch.page';
import { CaseNameSearchResultsPage } from '../PageObjects/CaseNameSearchResults.page';
import { SubscriptionUrnSearchResultsPage } from '../PageObjects/SubscriptionUrnSearchResults.page';
import { SubscriptionUrnSearchPage } from '../PageObjects/SubscriptionUrnSearch.page';
import { CourtNameSearchPage } from '../PageObjects/CourtNameSearch.page';
import { MockSessionPage } from '../PageObjects/MockSession.page';
import { SingleJusticeProcedurePage } from '../PageObjects/SingleJusticeProcedure.page';
import { CaseEventGlossaryPage } from '../PageObjects/CaseEventGlossary.page';

const homePage = new HomePage;
const mockSessionPage = new MockSessionPage();
let subscriptionAddPage = new SubscriptionAddPage();
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
let caseEventGlossaryPage: CaseEventGlossaryPage;

describe('Unverified user', () => {
  it('should open main page with \'See publications and information from a court or tribunal\' title', async () => {
    await homePage.open('');
    expect(await homePage.getPageTitle()).toEqual('See publications and information from a court or tribunal');
  });

  it('should click on the \'Start now\' button and navigate to View Options page', async () => {
    viewOptionPage = await homePage.clickStartNowButton();
    expect(await viewOptionPage.getPageTitle()).toEqual('What would you like to view?');
  });

  it('should see 3 radio buttons', async () => {
    expect(await viewOptionPage.radioButtons).toBe(3);
  });

  describe('find a court or tribunal publication', async () => {
    it('should select \'Court or Tribunal hearing Publications\' option and navigate to search option page', async () => {
      await viewOptionPage.selectOption('CourtOrTribunalRadioButton');
      searchOptionsPage = await viewOptionPage.clickContinueForSearch();
      expect(await searchOptionsPage.getPageTitle()).toEqual('Do you know the name of the court or tribunal?');
    });

    describe('following the \'I have the name\' path', async () => {
      const searchTerm = 'Blackpool Magistrates\' Court';
      const expectedNumOfHearings = 9;

      it('should select \'I have the name\' option and navigate to search page', async () => {
        await searchOptionsPage.selectOption('HaveNameRadio');
        searchPage = await searchOptionsPage.clickContinueForSearch();
        expect(await searchPage.getPageTitle()).toEqual('What court or tribunal are you interested in?');
      });

      it('should enter text and click continue', async () => {
        await searchPage.enterText(searchTerm);
        hearingListPage = await searchPage.clickContinue();
        expect(await hearingListPage.getPageTitle()).toEqual('Blackpool Magistrates\' Court hearing list');
      });

      it(`should display ${expectedNumOfHearings} results`, async () => {
        expect(await hearingListPage.getResults()).toBe(expectedNumOfHearings);
      });
    });

    describe('following the \'I do not have the name\' path', async () => {
      const expectedHearings = 15;

      before(async () => {
        await searchOptionsPage.open('/search-option');
      });

      it('should select \'I do not have the name\' option and navigate to alphabetical search page', async () => {
        await searchOptionsPage.selectOption('DontHaveNameRadio');
        alphabeticalSearchPage = await searchOptionsPage.clickContinueForAlphabetical();
        expect(await alphabeticalSearchPage.getPageTitle()).toEqual('Find a court or tribunal');
      });

      it('should select Magistrates\' Court and North West filters', async () => {
        await alphabeticalSearchPage.selectFilter('MagistratesFilter');
        await alphabeticalSearchPage.selectFilter('NorthWestFilter');
        await alphabeticalSearchPage.clickApplyFiltersButton();
        expect(await alphabeticalSearchPage.getPageTitle()).toEqual('Find a court or tribunal');
      });

      it('should have Magistrates\' Court and North West filters selected', async () => {
        expect(await alphabeticalSearchPage.checkIfSelected('MagistratesFilter')).toBeTruthy();
        expect(await alphabeticalSearchPage.checkIfSelected('NorthWestFilter')).toBeTruthy();
      });

      it('selecting first result should take you to to the hearings list page', async () => {
        hearingListPage = await alphabeticalSearchPage.selectFirstListResult();
        expect(await hearingListPage.getPageTitle()).toEqual('Blackburn Magistrates\' Court hearing list');
      });

      it(`should display ${expectedHearings} results`, async() => {
        expect(await hearingListPage.getResults()).toBe(expectedHearings);
      });
    });
  });

  describe('find live case status updates', async () => {
    const validCourtName = 'Amersham Law Courts';

    before(async () => {
      await viewOptionPage.open('/view-option');
    });

    it('should select \'live hearing updates\' option and navigate to live hearings page', async () => {
      await viewOptionPage.selectOption('LiveHearingsRadioButton');
      liveCaseCourtSearchControllerPage = await viewOptionPage.clickContinueForLiveHearings();
      expect(await liveCaseCourtSearchControllerPage.getPageTitle()).toEqual('Live hearing updates - select a court');
    });

    it('selecting first result should take you to to the live hearings list page', async () => {
      liveCaseStatusPage = await liveCaseCourtSearchControllerPage.selectFirstValidListResult();
      expect(await liveCaseStatusPage.getPageTitle()).toEqual('Live hearing updates');
    });

    it(`should have '${validCourtName}' as a sub title`, async () => {
      expect(await liveCaseStatusPage.getCourtTitle()).toEqual(validCourtName);
    });

    it('should display 4 results in the table', async () => {
      expect(await liveCaseStatusPage.getResults()).toBe(4);
    });

    it('should select first glossary term', async () => {
      caseEventGlossaryPage = await liveCaseStatusPage.selectGlossaryTerm();
      expect(await caseEventGlossaryPage.getPageTitle()).toEqual('Live hearing updates - glossary of terms');
    });

    it('should display glossary', async () => {
      expect(await caseEventGlossaryPage.termIsInView()).toBeTruthy();
    });
  });

  describe('find single justice procedure cases', () => {
    before(async () => {
      await viewOptionPage.open('/view-option');
    });

    it('should select \'Single Justice Procedure case\' option and navigate to Single Justice Procedure case page', async () => {
      await viewOptionPage.selectOption('SingleJusticeProcedureRadioButton');
      singleJusticeProcedurePage = await viewOptionPage.clickContinueSingleJusticeProcedure();
      expect(await singleJusticeProcedurePage.getPageTitle()).toEqual('Single Justice Procedure cases');
    });
  });
});

describe('Verified user', () => {
  describe('sign in process', async () => {
    it('should open Session Mock Page to authenticate user', async () => {
      await mockSessionPage.open('/mock-session');
      expect(await mockSessionPage.getPageTitle()).toBe('Mock User Session Data');
    });

    it('should fill session form and open subscription management page', async () => {
      await mockSessionPage.enterText('Joe Bloggs', 'UsernameInput');
      await mockSessionPage.enterText('1', 'UserIdInput');
      await mockSessionPage.selectOption('UserType');
      subscriptionManagementPage = await mockSessionPage.clickContinue();
      expect(await subscriptionManagementPage.getPageTitle()).toBe('Your subscriptions');
    });
  });

  describe('add subscription', async () => {
    it('should navigate to add subscription page on button click', async () => {
      subscriptionAddPage = await subscriptionManagementPage.clickAddNewSubscriptionButton();
      expect(await subscriptionAddPage.getPageTitle()).toBe('How do you want to add a subscription?');
    });

    describe('following the URN path', async () => {
      const validSearchTerm = 'N363N6R4OG';
      const expectedNumOfResults = 1;

      it('should select \'By unique reference number\' option and navigate to search urn page', async () => {
        await subscriptionAddPage.selectOption('SubscriptionAddByUniqueRefNumber');
        subscriptionUrnSearchPage = await subscriptionAddPage.clickContinueForUrnSearch();
        expect(await subscriptionUrnSearchPage.getPageTitle()).toEqual('Enter a unique reference number');
      });

      it('should enter text and click continue', async () => {
        await subscriptionUrnSearchPage.enterText(validSearchTerm);
        subscriptionUrnSearchResultsPage = await subscriptionUrnSearchPage.clickContinue();
        expect(await subscriptionUrnSearchResultsPage.getPageTitle()).toEqual('Search result');
      });

      it(`should display ${expectedNumOfResults} results`, async() => {
        expect(await subscriptionUrnSearchResultsPage.getResults()).toBe(1);
      });
    });

    describe('following the case name path', async () => {
      const validCaseName = 'jadon';
      const casesCount = 1;

      before(async () => {
        await subscriptionAddPage.open('/subscription-add');
      });

      it('should open case name search path', async () => {
        await subscriptionAddPage.selectOption('SubscriptionAddByCaseName');
        caseNameSearchPage = await subscriptionAddPage.clickContinueForCaseName();
        expect(await caseNameSearchPage.getPageTitle()).toBe('Enter a case name');
      });

      it('should search for a valid case name and navigate to results page', async () => {
        await caseNameSearchPage.enterText(validCaseName);
        caseNameSearchResultsPage = await caseNameSearchPage.clickContinue();
        expect(await caseNameSearchResultsPage.getPageTitle()).toBe('Search result');
      });

      it(`should display ${casesCount} results`, async () => {
        expect(await caseNameSearchResultsPage.getResults()).toBe(casesCount);
      });
    });

    describe('following court or tribunal page', async () => {
      const allCourts = 304;
      const tribunalCourts = 48;

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

      it('should select first jurisdiction filter', async () => {
        await courtNameSearchPage.selectOption('JurisdictionCheckbox');
        expect(await courtNameSearchPage.jurisdictionChecked()).toBeTruthy();
      });

      it('should click on the apply filters button', async () => {
        courtNameSearchPage = await courtNameSearchPage.clickApplyFiltersButton();
        expect(await courtNameSearchPage.getPageTitle()).toBe('Subscribe by court or tribunal name');
      });

      it(`should display ${tribunalCourts} results (Tribunal) filter`, async() => {
        expect(await courtNameSearchPage.getResults()).toBe(tribunalCourts);
      });
    });
  });

  describe('remove subscription', async () => {
    before(async () => {
      await subscriptionManagementPage.open('subscription-management');
    });

    it('should click on the first unsubscribe record', async () => {
      // TODO: add PUB-743 tests here
    });
  });
});
