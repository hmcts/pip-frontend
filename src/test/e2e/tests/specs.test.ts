import { AccountHomePage } from '../PageObjects/AccountHome.page';
import { AdminDashboardPage } from '../PageObjects/AdminDashboard.page';
import { AlphabeticalSearchPage } from '../PageObjects/AlphabeticalSearch.page';
import { CaseEventGlossaryPage } from '../PageObjects/CaseEventGlossary.page';
import { CaseNameSearchPage } from '../PageObjects/CaseNameSearch.page';
import { CaseNameSearchResultsPage } from '../PageObjects/CaseNameSearchResults.page';
import { CaseReferenceNumberSearchPage } from '../PageObjects/CaseReferenceNumberSearch.page';
import { CaseReferenceNumberSearchResultsPage } from '../PageObjects/CaseReferenceNumberSearchResults.page';
import { CourtNameSearchPage } from '../PageObjects/CourtNameSearch.page';
import { CreateMediaAccountPage } from '../PageObjects/CreateMediaAccount.page';
import { DailyCauseListPage } from '../PageObjects/DailyCauseList.page';
import { DeleteSubscriptionPage } from '../PageObjects/DeleteSubscription.page';
import { FileUploadConfirmationPage } from '../PageObjects/FileUploadConfirmation.page';
import { HomePage } from '../PageObjects/Home.page';
import { InterstitialPage } from '../PageObjects/Interstitial.page';
import { LiveCaseCourtSearchControllerPage } from '../PageObjects/LiveCaseCourtSearchController.page';
import { LiveCaseStatusPage } from '../PageObjects/LiveCaseStatus.page';
import { ManualUploadPage } from '../PageObjects/ManualUpload.page';
import { ManualUploadSummaryPage } from '../PageObjects/ManualUploadSummary.page';
import { MediaAccountRequestSubmittedPage } from '../PageObjects/MediaAccountRequestSubmitted.page';
import { PendingSubscriptionsPage } from '../PageObjects/PendingSubscriptions.page';
import { SearchPage } from '../PageObjects/Search.page';
import { SignInPage } from '../PageObjects/SignIn.page';
import { SingleJusticeProcedurePage } from '../PageObjects/SingleJusticeProcedure.page';
import { SJPPublicListPage } from '../PageObjects/SJPPublicList.page';
import { SubscriptionAddPage } from '../PageObjects/SubscriptionAdd.page';
import { SubscriptionConfirmedPage } from '../PageObjects/SubscriptionConfirmed.page';
import { SubscriptionManagementPage } from '../PageObjects/SubscriptionManagement.page';
import { SubscriptionUrnSearchPage } from '../PageObjects/SubscriptionUrnSearch.page';
import { SubscriptionUrnSearchResultsPage } from '../PageObjects/SubscriptionUrnSearchResults.page';
import { SummaryOfPublicationsPage } from '../pageobjects/SummaryOfPublications.page';
import { UnsubscribeConfirmationPage } from '../PageObjects/UnsubscribeConfirmation.page';
import { ViewOptionPage } from '../PageObjects/ViewOption.page';

const homePage = new HomePage;
let subscriptionAddPage = new SubscriptionAddPage();
let subscriptionManagementPage: SubscriptionManagementPage;
const liveCaseCourtSearchControllerPage = new LiveCaseCourtSearchControllerPage();
let viewOptionPage: ViewOptionPage;
let summaryOfPublicationsPage: SummaryOfPublicationsPage;
let alphabeticalSearchPage: AlphabeticalSearchPage;
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
let manualUploadSummaryPage: ManualUploadSummaryPage;
let fileUploadConfirmationPage: FileUploadConfirmationPage;
let pendingSubscriptionsPage: PendingSubscriptionsPage;
let subscriptionConfirmedPage: SubscriptionConfirmedPage;
let manualUploadPage: ManualUploadPage;
const adminDashboard = new AdminDashboardPage;
let createMediaAccountPage: CreateMediaAccountPage;
let mediaAccountRequestSubmittedPage: MediaAccountRequestSubmittedPage;
let interstitialPage: InterstitialPage;
let accountHomePage: AccountHomePage;
let dailyCauseListPage: DailyCauseListPage;
let sjpPublicListPage: SJPPublicListPage;
let signInPage: SignInPage;

describe('Unverified user', () => {
  it('should open main page with \'See publications and information from a court or tribunal\' title', async () => {
    await homePage.open('');
    expect(await homePage.getPageTitle()).toEqual('HMCTS hearing lists');
  });

  it('should click on the \'Courts and tribunal hearings\' link and navigate to Interstitial page', async () => {
    interstitialPage = await homePage.clickLinkToService();
    expect(await interstitialPage.getPageTitle()).toEqual('Court and tribunal hearings');
  });

  it('should click on the continue and navigate to View Options page', async () => {
    viewOptionPage = await interstitialPage.clickContinue();
    expect(await viewOptionPage.getPageTitle()).toEqual('What do you want to do?');
  });

  it('should see 2 radio buttons', async () => {
    expect(await viewOptionPage.radioButtons).toBe(2);
  });

  describe('find a court or tribunal', async () => {
    it('should select \'Court or Tribunal hearing Publications\' option and navigate to search option page', async () => {
      await viewOptionPage.selectOption('CourtOrTribunalRadioButton');
      searchPage = await viewOptionPage.clickContinueForSearch();
      expect(await searchPage.getPageTitle()).toEqual('What court or tribunal are you interested in?');
    });

    describe('following the search court path', async () => {
      const searchTerm = 'Wrexham County And Family Court';

      it('should enter text and click continue', async () => {
        await searchPage.enterText(searchTerm);
        summaryOfPublicationsPage = await searchPage.clickContinue();
        expect(await summaryOfPublicationsPage.getPageTitle()).toEqual('What do you want to view from Wrexham County And Family Court?');
      });

      it('should select the first publication', async () => {
        dailyCauseListPage = await summaryOfPublicationsPage.clickSOPListItem();
        expect(await dailyCauseListPage.getPageTitle()).toContain('Wrexham County And Family Court');
      });
    });

    describe('following the \'Select from an A-Z of courts and tribunals\' path', async () => {
      before(async () => {
        await searchPage.open('/search');
      });

      it('should click on \'Select from an A-Z of courts and tribunals\' link ', async () => {
        alphabeticalSearchPage = await searchPage.clickAToZCourtsLink();
        expect(await alphabeticalSearchPage.getPageTitle()).toEqual('Find a court or tribunal');
      });

      it('should select Country Court jurisdiction and Wales region filters', async () => {
        await alphabeticalSearchPage.selectOption('JurisdictionFilter3');
        await alphabeticalSearchPage.selectOption('RegionFilter2');
        await alphabeticalSearchPage.clickApplyFiltersButton();
        expect(await alphabeticalSearchPage.checkIfSelected('JurisdictionFilter3')).toBeTruthy();
        expect(await alphabeticalSearchPage.checkIfSelected('RegionFilter2')).toBeTruthy();
      });

      it('selecting last result should take you to to the summary of publications page', async () => {
        summaryOfPublicationsPage = await alphabeticalSearchPage.selectLastListResult();
        expect(await summaryOfPublicationsPage.getPageTitle()).toEqual('What do you want to view from Wrexham County And Family Court?');
      });

      it('should select the first publication', async () => {
        dailyCauseListPage = await summaryOfPublicationsPage.clickSOPListItem();
        expect(await dailyCauseListPage.getPageTitle()).toContain('Wrexham County And Family Court');
      });
    });

    if (process.env.EXCLUDE_E2E === 'true') {
      // TODO: excluded at the moment, no real journey yet
      describe('find live case status updates', async () => {
        const validCourtName = 'Northampton Crown Court';

        before(async () => {
          await liveCaseCourtSearchControllerPage.open('/live-case-alphabet-search');
        });

        it('selecting first result should take you to to the live hearings list page', async () => {
          liveCaseStatusPage = await liveCaseCourtSearchControllerPage.selectFirstValidListResult();
          expect(await liveCaseStatusPage.getPageTitle()).toContain('Live hearing updates');
        });

        it(`should have '${validCourtName}' as a sub title`, async () => {
          expect(await liveCaseStatusPage.getCourtTitle()).toContain(validCourtName);
        });

        it('should select first glossary term', async () => {
          caseEventGlossaryPage = await liveCaseStatusPage.selectGlossaryTerm();
          expect(await caseEventGlossaryPage.getPageTitle()).toEqual('Live hearing updates - glossary of terms');
        });

        it('should display glossary', async () => {
          expect(await caseEventGlossaryPage.termIsInView()).toBeTruthy();
        });
      });
    }

    describe('find single justice procedure cases', () => {
      before(async () => {
        await viewOptionPage.open('/view-option');
      });
      it('should select \'Single Justice Procedure case\' option and navigate to Single Justice Procedure case page', async () => {
        await viewOptionPage.selectOption('SingleJusticeProcedureRadioButton');
        singleJusticeProcedurePage = await viewOptionPage.clickContinueSingleJusticeProcedure();
        expect(await singleJusticeProcedurePage.getPageTitle()).toEqual('What do you want to view from Single Justice Procedure (SJP)?');
      });

      //TODO: enable once staging has valid SJP publication
      if (process.env.EXCLUDE_E2E === 'true') {
        it('should select first list item', async () => {
          sjpPublicListPage = await singleJusticeProcedurePage.clickSOPListItem();
          expect(await sjpPublicListPage.getPageTitle()).toEqual('Single Justice Procedure cases that are ready for hearing');
        });
      }
    });
  });

  describe('banner navigation', () => {
    before(async () => {
      await alphabeticalSearchPage.open('/alphabetical-search');
    });

    it('should click on the Home navigation link and take user to view option page', async () => {
      viewOptionPage = await alphabeticalSearchPage.clickNavHome();
      expect(await viewOptionPage.getPageTitle()).toEqual('What do you want to do?');
    });

    it('should click on the Find a court or tribunal navigation link and take user to search page', async () => {
      searchPage = await viewOptionPage.clickFindACourtBannerLink();
      expect(await searchPage.getPageTitle()).toEqual('What court or tribunal are you interested in?');
    });

    it('should click on the SJP cases navigation link and take user to SJP list page', async () => {
      summaryOfPublicationsPage = await searchPage.clickNavSJP(false);
      expect(await summaryOfPublicationsPage.getPageTitle()).toContain('What do you want to view');
    });

    it('should click on the Sign in navigation link and take user to the sign in page', async () => {
      signInPage = await summaryOfPublicationsPage.clickSignInBannerLink();
      expect(await signInPage.getPageTitle()).toEqual('How do you want to sign in?');
    });
  });

  describe('request an account', () => {
    it('should open sign-in page with \'How do you want to sign in\' title', async () => {
      expect(await signInPage.getPageTitle()).toEqual('How do you want to sign in?');
    });

    it('should click on the create account link', async () => {
      createMediaAccountPage = await signInPage.clickCreateAccount();
      expect(await createMediaAccountPage.getPageTitle()).toEqual('Create a court and tribunal hearing account');
    });

    it('should complete form and continue to confirmation page', async () => {
      await createMediaAccountPage.completeForm();
      mediaAccountRequestSubmittedPage = await createMediaAccountPage.clickContinue();
      expect(await mediaAccountRequestSubmittedPage.getPanelTitle()).toEqual('Details submitted');
    });
  });
});

describe('Verified user', () => {
  describe('Sign In Page', () => {
    const HMCTSAccountUrl = 'https://hmcts-sjp.herokuapp.com/sign-in-idam.html';

    it('should open sign-in page with \'How do you want to sign in\' title', async () => {
      await signInPage.open('/sign-in');
      expect(await signInPage.getPageTitle()).toEqual('How do you want to sign in?');
    });

    it('should see 3 radio buttons', async () => {
      expect(await signInPage.radioButtons).toBe(3);
    });

    describe('sign in process and page routing', async () => {
      it('should select \'Sign in with My HMCTS\' option and navigate to the login page HMCTS page', async () => {
        await signInPage.open('/sign-in');
        await signInPage.selectOption('SignInRadio1');
        expect(await signInPage.clickContinueForRadio1()).toHaveHref(HMCTSAccountUrl);
      });

      it('should select \'Sign in with Common Platform\' option and navigate to the login page Common Platform page', async () => {
        await signInPage.open('/sign-in');
        await signInPage.selectOption('SignInRadio2');
        expect(await signInPage.clickContinueForRadio2()).toHaveHref(HMCTSAccountUrl);
      });

      it('should select \'Sign in with my P&I details\' option, navigate to the login page, and sign in', async () => {
        await signInPage.open('/sign-in');
        await signInPage.selectOption('SignInRadio3');
        await signInPage.clickContinueForRadio3();
        console.log('B2C_USERNAME', process.env.B2C_USERNAME);
        await signInPage.enterText(process.env.B2C_USERNAME, 'EmailField');
        await signInPage.enterText(process.env.B2C_PASSWORD, 'PasswordField');
        accountHomePage = await signInPage.clickSignIn();
        await browser.pause(2000);
      });

      it('should open account home page on successful sign in', async () => {
        expect(await accountHomePage.getPageTitle()).toBe('Your account');
      });
    });
  });

  describe('add subscription', async () => {
    it('should click on Email Subscriptions and navigate to subscription management page', async () => {
      subscriptionManagementPage = await accountHomePage.clickSubscriptionsCard();
      expect(await subscriptionManagementPage.getPageTitle()).toBe('Your subscriptions');
    });

    it('should navigate to add subscription page on button click', async () => {
      subscriptionAddPage = await subscriptionManagementPage.clickAddNewSubscriptionButton();
      expect(await subscriptionAddPage.getPageTitle()).toBe('How do you want to add a subscription?');
    });

    //TODO: excluded URN as there are no any at the moment
    if (process.env.EXCLUDE_E2E === 'true') {
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
    }

    describe('following the case name path', async () => {
      const validCaseName = 'Stark-v-Iron';
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

      it(`should display ${casesCount} result(s)`, async () => {
        expect(await caseNameSearchResultsPage.getResults()).toBe(casesCount);
      });

      it('should click continue to create subscription', async () => {
        pendingSubscriptionsPage = await caseNameSearchResultsPage.clickContinue();
        expect(await pendingSubscriptionsPage.getPageTitle()).toEqual('Confirm your subscriptions');
      });
    });

    describe('following court or tribunal path', async () => {
      before(async () => {
        await subscriptionAddPage.open('subscription-add');
      });

      it('should open court or tribunal name search page', async () => {
        await subscriptionAddPage.selectOption('SubscriptionAddByCourtOrTribunal');
        courtNameSearchPage = await subscriptionAddPage.clickContinueForCourtOrTribunal();
        expect(await courtNameSearchPage.getPageTitle()).toBe('Subscribe by court or tribunal name');
      });

      it('should select first jurisdiction filter', async () => {
        await courtNameSearchPage.selectOption('JurisdictionCheckbox');
        expect(await courtNameSearchPage.jurisdictionChecked()).toBeTruthy();
      });

      it('should click on the apply filters button', async () => {
        courtNameSearchPage = await courtNameSearchPage.clickApplyFiltersButton();
        expect(await courtNameSearchPage.getPageTitle()).toBe('Subscribe by court or tribunal name');
      });

      it('should click continue to create subscription', async () => {
        pendingSubscriptionsPage = await courtNameSearchPage.clickContinue();
        expect(await pendingSubscriptionsPage.getPageTitle()).toEqual('Confirm your subscriptions');
      });
    });

    describe('following the case reference number path', () => {
      const validSearchTerm = 'H01CF553';

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
    it('should open admin dashboard page', async () => {
      await adminDashboard.open('/admin-dashboard');
      expect(await adminDashboard.getPageTitle()).toEqual('Admin dashboard');
    });

    describe('Manual Upload', () => {
      it('should open manual upload page', async () => {
        manualUploadPage = await adminDashboard.clickUploadFileCard();
        expect(await manualUploadPage.getPageTitle()).toEqual('Manual upload');
      });

      it('should complete form and open summary page', async () => {
        await manualUploadPage.completeForm();
        manualUploadSummaryPage = await manualUploadPage.clickContinue();
        expect(await manualUploadSummaryPage.getPageTitle()).toEqual('Check upload details');
      });

      it('should open upload confirmation page', async () => {
        fileUploadConfirmationPage = await manualUploadSummaryPage.clickContinue();
        expect(await fileUploadConfirmationPage.getPanelTitle()).toEqual('Success');
      });
    });
  });

  describe('banner navigation', () => {
    before(async () => {
      await accountHomePage.open('account-home');
    });

    it('should click on the Email subscriptions navigation link and take user to subscription management page', async () => {
      subscriptionManagementPage = await accountHomePage.clickEmailSubscriptionsNavLink();
      expect(await subscriptionManagementPage.getPageTitle()).toEqual('Your subscriptions');
    });

    it('should click on the Find a court or tribunal navigation link and take user to the search page', async () => {
      searchPage = await subscriptionManagementPage.clickFindCourtNavLink();
      expect(await searchPage.getPageTitle()).toEqual('What court or tribunal are you interested in?');
    });

    it('should click on the SJP cases navigation link and take user to the sjp page', async () => {
      summaryOfPublicationsPage = await searchPage.clickNavSJP(true);
      expect(await summaryOfPublicationsPage.getPageTitle()).toContain('What do you want to view');
    });

    it('should click on the Home navigation link and take user to your account page', async () => {
      accountHomePage = await summaryOfPublicationsPage.clickSignedInHomeBannerLink();
      expect(await accountHomePage.getPageTitle()).toEqual('Your account');
    });
  });

  describe('account home cards navigation', () => {
    beforeEach(async () => {
      await accountHomePage.open('account-home');
    });

    it('should click on the Court card and take user to the search page', async () => {
      searchPage = await accountHomePage.clickCourtCard();
      expect(await searchPage.getPageTitle()).toEqual('What court or tribunal are you interested in?');
    });

    it('should click on the SJP card and take user to the sjp list', async () => {
      summaryOfPublicationsPage = await accountHomePage.clickSJPCard();
      expect(await summaryOfPublicationsPage.getPageTitle()).toContain('What do you want to view');
    });
  });

  describe('sign out', () => {
    before(async () => {
      await accountHomePage.open('account-home');
    });

    it('should sign out and open view-option page', async () => {
      viewOptionPage = await accountHomePage.clickSignOut();
      expect(await viewOptionPage.getPageTitle()).toEqual('What do you want to do?');
    });
  });
});
