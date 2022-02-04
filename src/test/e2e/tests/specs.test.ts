import { HomePage } from '../PageObjects/Home.page';
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
import { CaseReferenceNumberSearchPage } from '../PageObjects/CaseReferenceNumberSearch.page';
import { CaseReferenceNumberSearchResultsPage } from '../PageObjects/CaseReferenceNumberSearchResults.page';
import { SignInPage } from '../PageObjects/SignIn.page';
import { getRedirectURL } from '../../../main/authentication/authRedirect';
import { DeleteSubscriptionPage } from '../PageObjects/DeleteSubscription.page';
import { UnsubscribeConfirmationPage } from '../PageObjects/UnsubscribeConfirmation.page';
import { PendingSubscriptionsPage } from '../PageObjects/PendingSubscriptions.page';
import { SubscriptionConfirmedPage } from '../PageObjects/SubscriptionConfirmed.page';
import {ManualUploadPage} from '../PageObjects/ManualUpload.page';

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
let deleteSubscriptionPage: DeleteSubscriptionPage;
let unsubscribeConfirmationPage: UnsubscribeConfirmationPage;
let pendingSubscriptionsPage: PendingSubscriptionsPage;
let subscriptionConfirmedPage: SubscriptionConfirmedPage;
const signInPage = new SignInPage;
const manualUploadPage = new ManualUploadPage;

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

      it(`should display ${expectedNumOfHearings} results`, async () => {
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
  describe('Sign In Page', () => {
    const pAndIRedirectUrl = getRedirectURL(process.env.ENV);
    const HMCTSAccountUrl = 'https://hmcts-sjp.herokuapp.com/sign-in-idam.html';

    beforeEach(async () => {
      await signInPage.open('/sign-in');
    });

    it('should open sign-in page with \'How do you want to sign in\' title', async () => {
      expect(await signInPage.getPageTitle()).toEqual('How do you want to sign in?');
    });

    it('should see 3 radio buttons', async () => {
      expect(await signInPage.radioButtons).toBe(3);
    });

    describe('sign in page routing', async () => {
      it('should select \'Sign in with My HMCTS\' option and navigate to the login page HMCTS page', async () => {
        await signInPage.selectOption('SignInRadio1');
        expect(await signInPage.clickContinueForRadio1()).toHaveHref(HMCTSAccountUrl);
      });

      it('should select \'Sign in with Common Platform\' option and navigate to the login page Common Platform page', async () => {
        await signInPage.selectOption('SignInRadio2');
        expect(await signInPage.clickContinueForRadio2()).toHaveHref(HMCTSAccountUrl);
      });

      it('should select \'Sign in with my P&I details\' option and navigate to the login page P&I details page', async () => {
        await signInPage.selectOption('SignInRadio3');
        expect(await signInPage.clickContinueForRadio3()).toHaveHref(pAndIRedirectUrl);
      });
    });
  });

  describe('sign in process', async () => {

    it('should open Session Mock Page to authenticate user', async () => {
      await mockSessionPage.open('/mock-session');
      expect(await mockSessionPage.getPageTitle()).toBe('Mock User Session Data');
    });

    it('should fill session form and open subscription management page', async () => {
      await mockSessionPage.enterText('Joe Bloggs', 'UsernameInput');
      await mockSessionPage.enterText('1', 'UserIdInput');
      await mockSessionPage.selectOption('UserType');

      // If USE_PROTOTYPE is set then it goes to Heroku, therefore re-open to Subscriptions Management
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
        expect(await subscriptionUrnSearchPage.getPageTitle()).toEqual('Enter a unique reference number (URN)');
      });

      it('should enter text and click continue', async () => {
        await subscriptionUrnSearchPage.enterText(validSearchTerm);
        subscriptionUrnSearchResultsPage = await subscriptionUrnSearchPage.clickContinue();
        expect(await subscriptionUrnSearchResultsPage.getPageTitle()).toEqual('Search result');
      });

      it(`should display ${expectedNumOfResults} results`, async () => {
        expect(await subscriptionUrnSearchResultsPage.getResults()).toBe(1);
      });

      it('should click continue to create subscription', async () => {
        pendingSubscriptionsPage = await subscriptionUrnSearchResultsPage.clickContinue();
        expect(await pendingSubscriptionsPage.getPageTitle()).toEqual('Confirm your subscriptions');
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

      it('should click continue to create subscription', async () => {
        pendingSubscriptionsPage = await caseNameSearchResultsPage.clickContinue();
        expect(await pendingSubscriptionsPage.getPageTitle()).toEqual('Confirm your subscriptions');
      });
    });

    describe('following court or tribunal page', async () => {
      const allCourts = 305;
      const tribunalCourts = 49;

      before(async () => {
        await subscriptionAddPage.open('subscription-add');
      });

      it('should open court or tribunal name search page', async () => {
        await subscriptionAddPage.selectOption('SubscriptionAddByCourtOrTribunal');
        courtNameSearchPage = await subscriptionAddPage.clickContinueForCourtOrTribunal();
        expect(await courtNameSearchPage.getPageTitle()).toBe('Subscribe by court or tribunal name');
      });

      it(`should display ${allCourts} results`, async () => {
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

      it(`should display ${tribunalCourts} results (Tribunal) filter`, async () => {
        expect(await courtNameSearchPage.getResults()).toBe(tribunalCourts);
      });

      it('should click continue to create subscription', async () => {
        pendingSubscriptionsPage = await courtNameSearchPage.clickContinue();
        expect(await pendingSubscriptionsPage.getPageTitle()).toEqual('Confirm your subscriptions');
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

      it('should click continue to create subscription', async () => {
        pendingSubscriptionsPage = await caseReferenceNumberSearchResultPage.clickContinue();
        expect(await pendingSubscriptionsPage.getPageTitle()).toEqual('Confirm your subscriptions');
      });
    });
  });

  describe('add subscription', async () => {
    before(async () => {
      await pendingSubscriptionsPage.open('pending-subscriptions');
    });

    it('should subscribe', async () => {
      subscriptionConfirmedPage = await pendingSubscriptionsPage.clickContinue();
      expect(await subscriptionConfirmedPage.getPanelTitle()).toEqual('Subscription confirmed');
    });
  });

  describe('remove subscription', async () => {
    before(async () => {
      await subscriptionManagementPage.open('subscription-management');
    });

    it('should click on the first unsubscribe record', async () => {
      deleteSubscriptionPage = await subscriptionManagementPage.clickUnsubscribeFromFirstRecord();
      expect(await deleteSubscriptionPage.getPageTitle()).toEqual('Are you sure you want to remove this subscription?');
    });

    it('should select yes option and unsubscribe', async () => {
      await deleteSubscriptionPage.selectOption('yesRadioButton');
      unsubscribeConfirmationPage = await deleteSubscriptionPage.clickContinueForYes();
      expect(await unsubscribeConfirmationPage.getPanelTitle()).toEqual('Subscription removed');
    });
  });
  describe('Admin level journeys', () => {
    describe('Manual Upload', () => {
      it('should open manual upload page', async () => {
        await manualUploadPage.open('/manual-upload');
        expect(await manualUploadPage.getPageTitle()).toEqual('Manual upload');
      });
      it('should complete form', async () => {
        manualUploadPage.completeForm();
      });
    });
  });
});
