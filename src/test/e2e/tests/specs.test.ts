import { HomePage } from '../pageobjects/Home.page';
import { AlphabeticalSearchPage } from '../pageobjects/AlphabeticalSearch.page';
import { HearingListPage } from '../pageobjects/HearingList.page';
import { SearchPage } from '../pageobjects/Search.page';
import { SubscriptionManagementPage } from '../pageobjects/SubscriptionManagement.page';
import { ViewOptionPage } from '../pageobjects/ViewOption.page';
import { LiveCaseCourtSearchControllerPage } from '../pageobjects/LiveCaseCourtSearchController.page';
import { SubscriptionAddPage } from '../pageobjects/SubscriptionAdd.page';
import { LiveCaseStatusPage } from '../pageobjects/LiveCaseStatus.page';
import { CaseNameSearchPage } from '../pageobjects/CaseNameSearch.page';
import { CaseNameSearchResultsPage } from '../pageobjects/CaseNameSearchResults.page';
import { SubscriptionUrnSearchResultsPage } from '../pageobjects/SubscriptionUrnSearchResults.page';
import { SubscriptionUrnSearchPage } from '../pageobjects/SubscriptionUrnSearch.page';
import { CourtNameSearchPage } from '../pageobjects/CourtNameSearch.page';
import { MockSessionPage } from '../pageobjects/MockSession.page';
import { SingleJusticeProcedurePage } from '../pageobjects/SingleJusticeProcedure.page';
import { CaseEventGlossaryPage } from '../pageobjects/CaseEventGlossary.page';
import { CaseReferenceNumberSearchPage } from '../pageobjects/CaseReferenceNumberSearch.page';
import { CaseReferenceNumberSearchResultsPage } from '../pageobjects/CaseReferenceNumberSearchResults.page';

const homePage = new HomePage;
const mockSessionPage = new MockSessionPage();
let subscriptionAddPage = new SubscriptionAddPage();
const subscriptionManagementPage = new SubscriptionManagementPage();
const liveCaseCourtSearchControllerPage = new LiveCaseCourtSearchControllerPage();
let viewOptionPage: ViewOptionPage;
let alphabeticalSearchPage: AlphabeticalSearchPage;
let hearingListPage: HearingListPage;
let searchPage: SearchPage;
let liveCaseStatusPage: LiveCaseStatusPage;
let singleJusticeProcedurePage: SingleJusticeProcedurePage;
let caseNameSearchPage: CaseNameSearchPage;
let caseNameSearchResultsPage: CaseNameSearchResultsPage;
let subscriptionUrnSearchResultsPage: SubscriptionUrnSearchResultsPage;
let subscriptionUrnSearchPage: SubscriptionUrnSearchPage;
let caseReferenceNumberSearchPage: CaseReferenceNumberSearchPage;
let caseReferenceNumberSearchResultPage: CaseReferenceNumberSearchResultsPage;
let courtNameSearchPage: CourtNameSearchPage;
let caseEventGlossaryPage: CaseEventGlossaryPage;

describe('Unverified user', () => {
  it('should open main page with \'See publications and information from a court or tribunal\' title', async () => {
    await homePage.open('');
    expect(await homePage.getPageTitle()).toEqual('HMCTS hearing lists');
  });

  it('should click on the \'Courts and tribunal hearings\' link and navigate to View Options page', async () => {
    viewOptionPage = await homePage.clickLinkToService();
    expect(await viewOptionPage.getPageTitle()).toEqual('What do you want to do?');
  });

  it('should see 2 radio buttons', async () => {
    expect(await viewOptionPage.radioButtons).toBe(2);
  });

  describe('find a court or tribunal publication', async () => {
    it('should select \'Court or Tribunal hearing Publications\' option and navigate to search option page', async () => {
      await viewOptionPage.selectOption('CourtOrTribunalRadioButton');
      searchPage = await viewOptionPage.clickContinueForSearch();
      expect(await searchPage.getPageTitle()).toEqual('What court or tribunal are you interested in?');
    });

    describe('following the \'I have the name\' path', async () => {
      const searchTerm = 'Blackpool Magistrates\' Court';
      const expectedNumOfHearings = 9;

      it('should enter text and click continue', async () => {
        await searchPage.enterText(searchTerm);
        hearingListPage = await searchPage.clickContinue();
        expect(await hearingListPage.getPageTitle()).toEqual('Blackpool Magistrates\' Court hearing list');
      });

      it(`should display ${expectedNumOfHearings} results`, async () => {
        expect(await hearingListPage.getResults()).toBe(expectedNumOfHearings);
      });
    });

    describe('following the \'Select from an A-Z of courts and tribunals\' path', async () => {
      const expectedNumOfHearings = 15;

      before(async () => {
        await searchPage.open('/search');
      });

      it('should click on \'Select from an A-Z of courts and tribunals\' link ', async () => {
        alphabeticalSearchPage = await searchPage.clickAToZCourtsLink();
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

      it(`should display ${expectedNumOfHearings} results`, async() => {
        expect(await hearingListPage.getResults()).toBe(expectedNumOfHearings);
      });
    });
  });

  describe('find live case status updates', async () => {
    const validCourtName = 'Amersham Law Courts';

    before(async () => {
      await liveCaseCourtSearchControllerPage.open('/live-case-alphabet-search');
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

      //If USE_PROTOTYPE is set then it goes to Heroku, therefore re-open to Subscription Management
      if (process.env.USE_PROTOTYPE) {
        await mockSessionPage.clickContinue();
        await subscriptionManagementPage.open('/subscription-management');
      } else {
        const subscriptionManagementPage = await mockSessionPage.clickContinue();
        expect(await subscriptionManagementPage.getPageTitle()).toBe('Your subscriptions');
      }
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

  describe('Following the subscription \'search\' by case reference path', () => {
    const validSearchTerm = 'T485913';
    const expectedNumOfResults = 1;

    before(async () => {
      await subscriptionAddPage.open('subscription-add');
    });

    it('should select \'By case reference number\' option and navigate to search case number page', async () => {
      await subscriptionAddPage.selectOption('SubscriptionAddByCaseRefNumber');
      caseReferenceNumberSearchPage = await subscriptionAddPage.clickContinueForCaseReferenceNumberSearch();
      expect(await caseReferenceNumberSearchPage.getPageTitle()).toEqual('Enter a case reference number');
    });

    it('should enter text and click continue', async () => {
      await caseReferenceNumberSearchPage.enterText(validSearchTerm);
      caseReferenceNumberSearchResultPage = await caseReferenceNumberSearchPage.clickContinue();
      expect(await caseReferenceNumberSearchResultPage.getPageTitle()).toEqual('Search result');
    });

    it(`should display ${expectedNumOfResults} results`, async () => {
      expect(await caseReferenceNumberSearchResultPage.getResults()).toBe(1);
    });
  });
});
