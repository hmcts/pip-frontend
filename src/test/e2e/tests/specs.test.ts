import { AccountHomePage } from '../PageObjects/AccountHome.page';
import { AdminDashboardPage } from '../PageObjects/AdminDashboard.page';
import { SystemAdminDashboardPage } from '../PageObjects/SystemAdminDashboard.page';
import { AlphabeticalSearchPage } from '../PageObjects/AlphabeticalSearch.page';
import { CaseEventGlossaryPage } from '../PageObjects/CaseEventGlossary.page';
import { CaseNameSearchPage } from '../PageObjects/CaseNameSearch.page';
import { CaseNameSearchResultsPage } from '../PageObjects/CaseNameSearchResults.page';
import { CaseReferenceNumberSearchPage } from '../PageObjects/CaseReferenceNumberSearch.page';
import { CaseReferenceNumberSearchResultsPage } from '../PageObjects/CaseReferenceNumberSearchResults.page';
import { LocationNameSearchPage } from '../PageObjects/LocationNameSearchPage';
import { CreateAdminAccountPage } from '../PageObjects/CreateAdminAccount.page';
import { CreateAdminAccountSummaryPage } from '../PageObjects/CreateAdminAccountSummary.page';
import { CreateSystemAdminAccountPage } from '../PageObjects/CreateSystemAdminAccount.page';
import { CreateSystemAdminAccountSummaryPage } from '../PageObjects/CreateSystemAdminAccountSummary.page';
import { DailyCauseListPage } from '../PageObjects/DailyCauseList.page';
import { DeleteSubscriptionPage } from '../PageObjects/DeleteSubscription.page';
import { FileUploadConfirmationPage } from '../PageObjects/FileUploadConfirmation.page';
import { HomePage } from '../PageObjects/Home.page';
import { LiveCaseCourtSearchControllerPage } from '../PageObjects/LiveCaseCourtSearchController.page';
import { LiveCaseStatusPage } from '../PageObjects/LiveCaseStatus.page';
import { ManualUploadPage } from '../PageObjects/ManualUpload.page';
import { ManualUploadSummaryPage } from '../PageObjects/ManualUploadSummary.page';
import { PendingSubscriptionsPage } from '../PageObjects/PendingSubscriptions.page';
import { RemoveListConfirmationPage } from '../PageObjects/RemoveListConfirmation.page';
import { RemoveListSearchPage } from '../PageObjects/RemoveListSearch.page';
import { RemoveListSearchResultsPage } from '../PageObjects/RemoveListSearchResults.page';
import { RemoveListSuccessPage } from '../PageObjects/RemoveListSuccess.page';
import { SearchPage } from '../PageObjects/Search.page';
import { SignInPage } from '../PageObjects/SignIn.page';
import { SingleJusticeProcedurePage } from '../PageObjects/SingleJusticeProcedure.page';
import { SJPPublicListPage } from '../PageObjects/SJPPublicList.page';
import { SubscriptionAddPage } from '../PageObjects/SubscriptionAdd.page';
import { SubscriptionConfigureListPage } from '../PageObjects/SubscriptionConfigureList.page';
import { SubscriptionConfirmedPage } from '../PageObjects/SubscriptionConfirmed.page';
import { SubscriptionManagementPage } from '../PageObjects/SubscriptionManagement.page';
import { SubscriptionUrnSearchPage } from '../PageObjects/SubscriptionUrnSearch.page';
import { SubscriptionUrnSearchResultsPage } from '../PageObjects/SubscriptionUrnSearchResults.page';
import { SummaryOfPublicationsPage } from '../pageobjects/SummaryOfPublications.page';
import { UnsubscribeConfirmationPage } from '../PageObjects/UnsubscribeConfirmation.page';
import { ViewOptionPage } from '../PageObjects/ViewOption.page';
import {MediaAccountRequestsPage} from '../PageObjects/MediaAccountRequests.page';
import {MediaAccountReviewPage} from '../PageObjects/MediaAccountReview.page';
import {MediaAccountApprovalPage} from '../PageObjects/MediaAccountApproval.page';
import {MediaAccountRejectionPage} from '../PageObjects/MediaAccountRejection.page';
import {MediaAccountRejectionConfirmationPage} from '../PageObjects/MediaAccountRejectionConfirmation.page';
import {CreateMediaAccountPage} from '../PageObjects/CreateMediaAccount.page';
import {MediaAccountRequestSubmittedPage} from '../PageObjects/MediaAccountRequestSubmitted.page';
import {SessionLoggedOutPage} from '../PageObjects/SessionLoggedOut.page';
import {ManualReferenceDataUploadPage} from '../PageObjects/ManualReferenceDataUpload.page';
import {ManualReferenceDataUploadSummaryPage} from '../PageObjects/ManualReferenceDataUploadSummary.page';
import { BlobViewLocationsPage } from '../pageobjects/BlobViewLocationsPage';
import {BulkDeleteSubscriptionsPage} from '../PageObjects/BulkDeleteSubscriptions.page';
import {BulkDeleteSubscriptionsConfirmationPage} from '../PageObjects/BulkDeleteSubscriptionsConfirmation.page';
import {BulkDeleteSubscriptionsConfirmedPage} from '../PageObjects/BulkDeleteSubscriptionsConfirmed.page';
import { BlobViewPublicationsPage } from '../pageobjects/BlobViewPublicationsPage';
import { BlobViewJsonPage } from '../pageobjects/BlobViewJsonPage';

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
let locationNameSearchPage: LocationNameSearchPage;
let caseEventGlossaryPage: CaseEventGlossaryPage;
let deleteSubscriptionPage: DeleteSubscriptionPage;
let bulkDeleteSubscriptionsPage: BulkDeleteSubscriptionsPage;
let bulkDeleteSubscriptionsConfirmationPage: BulkDeleteSubscriptionsConfirmationPage;
let bulkDeleteSubscriptionsConfirmedPage: BulkDeleteSubscriptionsConfirmedPage;
let unsubscribeConfirmationPage: UnsubscribeConfirmationPage;
let manualUploadSummaryPage: ManualUploadSummaryPage;
let fileUploadConfirmationPage: FileUploadConfirmationPage;
let pendingSubscriptionsPage: PendingSubscriptionsPage;
let subscriptionConfirmedPage: SubscriptionConfirmedPage;
let manualUploadPage: ManualUploadPage;
let adminDashboard = new AdminDashboardPage;
let systemAdminDashboard = new SystemAdminDashboardPage;
let createMediaAccountPage: CreateMediaAccountPage;
let mediaAccountRequestSubmittedPage: MediaAccountRequestSubmittedPage;
let accountHomePage: AccountHomePage;
let dailyCauseListPage: DailyCauseListPage;
let sjpPublicListPage: SJPPublicListPage;
let signInPage: SignInPage;
let createAdminAccountPage: CreateAdminAccountPage;
let createAdminAccountSummaryPage: CreateAdminAccountSummaryPage;
let createSystemAdminAccountPage: CreateSystemAdminAccountPage;
let createSystemAdminAccountSummaryPage: CreateSystemAdminAccountSummaryPage;
let searchPublicationPage: RemoveListSearchPage;
let searchPublicationResultsPage: RemoveListSearchResultsPage;
let publicationConfirmationPage: RemoveListConfirmationPage;
let removePublicationSuccessPage: RemoveListSuccessPage;
let mediaAccountRequestsPage: MediaAccountRequestsPage;
let mediaAccountReviewPage: MediaAccountReviewPage;
let mediaAccountApprovalPage: MediaAccountApprovalPage;
let mediaAccountRejectionPage: MediaAccountRejectionPage;
let mediaAccountRejectionConfirmationPage: MediaAccountRejectionConfirmationPage;
let subscriptionConfigureListPage: SubscriptionConfigureListPage;
let sessionLoggedOutPage: SessionLoggedOutPage;
let manualReferenceDataUploadPage: ManualReferenceDataUploadPage;
let manualReferenceDataUploadSummaryPage: ManualReferenceDataUploadSummaryPage;
let blobViewLocationsPage: BlobViewLocationsPage;
let blobViewPublicationsPage: BlobViewPublicationsPage;
let blobViewJsonPage: BlobViewJsonPage;

describe('Unverified user', () => {
  it('should open main page with \'See publications and information from a court or tribunal\' title', async () => {
    await homePage.open('');
    expect(await homePage.getPageTitle()).toEqual('Court and tribunal hearings');
  });

  it('should click accept cookies', async () => {
    expect(await homePage.cookieHeader()).toEqual('Cookies on Court and tribunal hearings');
    await homePage.clickAcceptCookies();
    await homePage.clickHideMessage();
  });

  it('should click on the continue and navigate to View Options page', async () => {
    viewOptionPage = await homePage.clickContinue();
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
      const searchTerm = 'High Wycombe Magistrates and County Court';

      it('should enter text and click continue', async () => {
        await searchPage.enterText(searchTerm);
        summaryOfPublicationsPage = await searchPage.clickContinue();
        expect(await summaryOfPublicationsPage.getPageTitle()).toEqual('What do you want to view from ' + searchTerm + '?');
      });

      it('should select the first publication', async () => {
        dailyCauseListPage = await summaryOfPublicationsPage.clickSOPListItem();
        expect(await dailyCauseListPage.getPageTitle()).toContain(searchTerm);
      });
    });

    describe('following the \'Select from an A-Z list of courts and tribunals\' path', async () => {
      before(async () => {
        await searchPage.open('/search');
      });

      const searchTerm = 'High Wycombe Magistrates and County Court';
      it('should click on \'Select from an A-Z list of courts and tribunals\' link ', async () => {
        alphabeticalSearchPage = await searchPage.clickAToZCourtsLink();
        expect(await alphabeticalSearchPage.getPageTitle()).toEqual('Find a court or tribunal');
      });

      it('should select Country Court jurisdiction and Wales region filters', async () => {
        await alphabeticalSearchPage.selectOption('JurisdictionFilter1');
        await alphabeticalSearchPage.selectOption('RegionFilter1');

        expect(await alphabeticalSearchPage.checkIfSelected('JurisdictionFilter1')).toBeTruthy();
        expect(await alphabeticalSearchPage.checkIfSelected('RegionFilter1')).toBeTruthy();
      });

      it('should click on the apply filters button', async () => {
        alphabeticalSearchPage = await alphabeticalSearchPage.clickApplyFiltersButton();
        expect(await alphabeticalSearchPage.getPageTitle()).toEqual('Find a court or tribunal');
      });

      it('selecting first result should take you to to the summary of publications page', async () => {
        summaryOfPublicationsPage = await alphabeticalSearchPage.selectFirstListResult();
        expect(await summaryOfPublicationsPage.getPageTitle()).toEqual('What do you want to view from '+ searchTerm + '?');
      });

      it('should select the first publication', async () => {
        dailyCauseListPage = await summaryOfPublicationsPage.clickSOPListItem();
        expect(await dailyCauseListPage.getPageTitle()).toContain(searchTerm);
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
        expect(await singleJusticeProcedurePage.getPageTitle()).toEqual('What do you want to view from Single Justice Procedure?');
      });

      it('should select first list item', async () => {
        sjpPublicListPage = await singleJusticeProcedurePage.clickSOPListItem();
        expect(await sjpPublicListPage.getPageTitle()).toEqual('Single Justice Procedure cases that are ready for hearing');
      });
    });
  });

  describe('banner navigation', () => {
    before(async () => {
      await alphabeticalSearchPage.open('/alphabetical-search');
    });

    it('should click on the Home navigation link and take user to the home/interstitial page', async () => {
      await alphabeticalSearchPage.clickNavHome();
      expect(await homePage.getPageTitle()).toEqual('Court and tribunal hearings');
    });

    it('should click on the Find a court or tribunal navigation link and take user to search page', async () => {
      await viewOptionPage.open('/view-option');
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
      expect(await createMediaAccountPage.getPageTitle()).toEqual('Create a Court and tribunal hearings account');
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
    it('should open sign-in page with \'How do you want to sign in\' title', async () => {
      await signInPage.open('/sign-in');
      expect(await signInPage.getPageTitle()).toEqual('How do you want to sign in?');
    });

    it('should see 3 radio buttons', async () => {
      expect(await signInPage.radioButtons).toBe(3);
    });

    describe('sign in process and page routing', async () => {
      it('should select \'Sign in with my P&I details\' option, navigate to the login page, and sign in', async () => {
        await signInPage.open('/sign-in');
        await signInPage.selectOption('SignInRadio3');
        await signInPage.clickContinueForRadio3();
        console.log('B2C_USERNAME', process.env.B2C_USERNAME);
        await signInPage.enterText(process.env.B2C_USERNAME, 'EmailField');
        await signInPage.enterText(process.env.B2C_PASSWORD, 'PasswordField');
        accountHomePage = await signInPage.clickSignIn();
      });

      it('should open account home page on successful sign in', async () => {
        expect(await accountHomePage.getPageTitle()).toBe('Your account');
      });
    });
  });

  describe('add subscription', async () => {
    it('should click on Email Subscriptions and navigate to subscription management page', async () => {
      subscriptionManagementPage = await accountHomePage.clickSubscriptionsCard();
      expect(await subscriptionManagementPage.getPageTitle()).toBe('Your email subscriptions');
    });

    it('should navigate to add subscription page on button click', async () => {
      subscriptionAddPage = await subscriptionManagementPage.clickAddNewSubscriptionButton();
      expect(await subscriptionAddPage.getPageTitle()).toBe('How do you want to add an email subscription?');
    });

    describe('following the URN path', async () => {
      const validSearchTerm = 'N363N6R4OG';
      const expectedNumOfResults = 1;

      it('should select \'By unique reference number\' option and navigate to search urn page', async () => {
        await subscriptionAddPage.selectOption('SubscriptionAddByUniqueRefNumber');
        subscriptionUrnSearchPage = await subscriptionAddPage.clickContinueForUrnSearch();
        expect(await subscriptionUrnSearchPage.getPageTitle()).toEqual('What is the unique reference number (URN)?');
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
        expect(await pendingSubscriptionsPage.getPageTitle()).toEqual('Confirm your email subscriptions');
      });
    });

    describe('following the case name path', async () => {
      const validCaseName = 'Anderson-v-Smith';
      const casesCount = 1;

      before(async () => {
        await subscriptionAddPage.open('/subscription-add');
      });

      it('should open case name search path', async () => {
        await subscriptionAddPage.selectOption('SubscriptionAddByCaseName');
        caseNameSearchPage = await subscriptionAddPage.clickContinueForCaseName();
        expect(await caseNameSearchPage.getPageTitle()).toBe('What is the name of the party or parties involved?');
      });

      it('should search for a valid case name and navigate to results page', async () => {
        await caseNameSearchPage.enterText(validCaseName);
        caseNameSearchResultsPage = await caseNameSearchPage.clickContinue();
        expect(await caseNameSearchResultsPage.getPageTitle()).toBe('Search result');
      });

      it(`should display ${casesCount} result(s)`, async () => {
        await caseNameSearchResultsPage.tickResultCheckbox();
        expect(await caseNameSearchResultsPage.getResults()).toBe(casesCount);
      });

      it('should click continue to create subscription', async () => {
        pendingSubscriptionsPage = await caseNameSearchResultsPage.clickContinue();
        expect(await pendingSubscriptionsPage.getPageTitle()).toEqual('Confirm your email subscriptions');
      });
    });

    describe('following court or tribunal path', async () => {
      before(async () => {
        await subscriptionAddPage.open('subscription-add');
      });

      it('should open court or tribunal name search page', async () => {
        await subscriptionAddPage.selectOption('SubscriptionAddByCourtOrTribunal');
        locationNameSearchPage = await subscriptionAddPage.clickContinueForCourtOrTribunal();
        expect(await locationNameSearchPage.getPageTitle()).toBe('Subscribe by court or tribunal name');
      });

      it('should select first jurisdiction filter', async () => {
        await locationNameSearchPage.selectOption('JurisdictionFilter1');
        expect(await locationNameSearchPage.jurisdictionChecked()).toBeTruthy();
      });

      it('should click on the apply filters button', async () => {
        locationNameSearchPage = await locationNameSearchPage.clickApplyFiltersButton();
        expect(await locationNameSearchPage.getPageTitle()).toBe('Subscribe by court or tribunal name');
      });

      it('should click continue to create subscription', async () => {
        await locationNameSearchPage.tickCourtCheckbox();
        pendingSubscriptionsPage = await locationNameSearchPage.clickContinue();
        expect(await pendingSubscriptionsPage.getPageTitle()).toEqual('Confirm your email subscriptions');
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
        expect(await caseReferenceNumberSearchPage.getPageTitle()).toEqual('What is the case reference number or case ID?');
      });

      it('should enter text and click continue', async () => {
        await caseReferenceNumberSearchPage.enterText(validSearchTerm);
        caseReferenceNumberSearchResultPage = await caseReferenceNumberSearchPage.clickContinue();
        expect(await caseReferenceNumberSearchResultPage.getPageTitle()).toEqual('Search result');
      });

      it('should click continue to create subscription', async () => {
        pendingSubscriptionsPage = await caseReferenceNumberSearchResultPage.clickContinue();
        expect(await pendingSubscriptionsPage.getPageTitle()).toEqual('Confirm your email subscriptions');
      });
    });

    describe('add subscription', async () => {
      before(async () => {
        await pendingSubscriptionsPage.open('pending-subscriptions');
      });

      it('should subscribe', async () => {
        subscriptionConfirmedPage = await pendingSubscriptionsPage.clickContinue();
        expect(await subscriptionConfirmedPage.getPanelTitle()).toEqual('Subscription(s) confirmed');
      });
    });

    //TODO: To be expanded on as the E2E tests are created for the configure list flow
    describe('configure list subscriptions', async () => {
      before(async () => {
        await subscriptionConfigureListPage.open('subscription-configure-list');
      });

      //TODO: To be uncommented once subscription management (1511) has been merged in

      // it('should select first jurisdiction filter', async () => {
      //   await subscriptionConfigureListPage.selectOption('JurisdictionFilter1');
      //   expect(await subscriptionConfigureListPage.jurisdictionChecked()).toBeTruthy();
      // });
      //
      // it('should click on the apply filters button', async () => {
      //   subscriptionConfigureListPage = await subscriptionConfigureListPage.clickApplyFiltersButton();
      //   expect(await subscriptionConfigureListPage.getPageTitle()).toBe('Select List Types');
      // });

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

    describe('bulk delete subscriptions', async () => {
      before(async () => {
        await subscriptionManagementPage.open('subscription-management');
      });

      it('should navigate to bulk delete subscriptions page on button click', async () => {
        bulkDeleteSubscriptionsPage = await subscriptionManagementPage.clickBulkDeleteSubscriptionsButton();
        expect(await bulkDeleteSubscriptionsPage.getPageTitle()).toBe('Bulk delete subscriptions');
      });

      it('should select first court subscription', async () => {
        await bulkDeleteSubscriptionsPage.selectOption('CourtSubscriptionCheckbox1');
        expect(await bulkDeleteSubscriptionsPage.courtSubscriptionChecked()).toBeTruthy();
      });

      it('should click on the bulk delete subscriptions button', async () => {
        bulkDeleteSubscriptionsConfirmationPage = await bulkDeleteSubscriptionsPage.clickBulkDeleteSubscriptionsButton();
        expect(await bulkDeleteSubscriptionsConfirmationPage.getPageTitle()).toBe('Are you sure you want to remove these subscriptions?');
      });

      it('should select yes option to delete the subscription', async () => {
        await bulkDeleteSubscriptionsConfirmationPage.selectOption('BulkDeleteRadioYes');
        bulkDeleteSubscriptionsConfirmedPage = await bulkDeleteSubscriptionsConfirmationPage.clickContinueForYes();
        expect(await bulkDeleteSubscriptionsConfirmedPage.getPanelTitle()).toEqual('Subscription(s) removed');
      });
    });
  });

  describe('banner navigation', () => {
    before(async () => {
      await accountHomePage.open('account-home');
    });

    it('should click on the Email subscriptions navigation link and take user to subscription management page', async () => {
      subscriptionManagementPage = await accountHomePage.clickEmailSubscriptionsNavLink();
      expect(await subscriptionManagementPage.getPageTitle()).toEqual('Your email subscriptions');
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

    it('should sign out and open session-logged-out page', async () => {
      sessionLoggedOutPage = await accountHomePage.clickSignOut();
      expect(await sessionLoggedOutPage.getPageTitle()).toEqual('You have been signed out');
    });
  });
});

describe('Admin level journeys', () => {
  it('should open Admin Login page', async () => {
    await signInPage.open('/admin-login?p=B2C_1_SignInAdminUserFlow');
    console.log('B2C_ADMIN_USERNAME', process.env.B2C_ADMIN_USERNAME);
    await signInPage.enterText(process.env.B2C_ADMIN_USERNAME, 'EmailField');
    await signInPage.enterText(process.env.B2C_ADMIN_PASSWORD, 'PasswordField');
    adminDashboard = await signInPage.clickAdminSignIn();
  });
  it('should open admin dashboard page on successful sign in', async () => {
    expect(await adminDashboard.getPageTitle()).toEqual('Your Dashboard');
  });
  it('should open admin dashboard page', async () => {
    await adminDashboard.open('/admin-dashboard');
    expect(await adminDashboard.getPageTitle()).toEqual('Your Dashboard');
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

  describe('Create new account', () => {
    it('should open admin dashboard page', async () => {
      await adminDashboard.open('/admin-dashboard');
      expect(await adminDashboard.getPageTitle()).toEqual('Your Dashboard');
    });
    it('should click on the create new account card', async () => {
      createAdminAccountPage = await adminDashboard.clickCreateNewAccountCard();
      expect(await createAdminAccountPage.getPageTitle()).toEqual('Create admin account');
    });
    it('should complete form and open summary page', async () => {
      await createAdminAccountPage.completeForm();
      createAdminAccountSummaryPage = await createAdminAccountPage.clickContinue();
      expect(await createAdminAccountSummaryPage.getPageTitle()).toEqual('Check account details');
    });
    //TODO: enable once ability to remove admin accounts comes in to prevent clogging of admin accounts as fails to create account that already exists
    if (process.env.EXCLUDE_E2E === 'true') {
      it('should click confirm and create user account', async () => {
        createAdminAccountSummaryPage = await createAdminAccountSummaryPage.clickConfirm();
        expect(await createAdminAccountSummaryPage.getPanelTitle()).toEqual('Account has been created');
      });
    }
  });

  describe('Manual Removal', () => {
    it('should open remove publication search page', async () => {
      await adminDashboard.open('/admin-dashboard');
      searchPublicationPage = await adminDashboard.clickRemoveCard();
      expect(await searchPublicationPage.getPageTitle()).toEqual('Find content to remove');
    });
    it('should enter valid court in the search field, click continue and open search results page', async () => {
      const searchTerm = 'Slough County Court and Family Court';
      await searchPublicationPage.enterText(searchTerm);
      searchPublicationResultsPage = await searchPublicationPage.clickContinue();
      expect(await searchPublicationResultsPage.getPageTitle()).toEqual('Select content to remove');
    });
    it('should click on the first result and open confirmation page', async () => {
      publicationConfirmationPage = await searchPublicationResultsPage.clickRemoveOnFirstRecord();
      expect(await publicationConfirmationPage.getPageTitle()).toEqual('Are you sure you want to remove this publication?');
    });
    it('should select yes option and remove publication', async () => {
      await publicationConfirmationPage.selectOption('remove-choice');
      removePublicationSuccessPage= await publicationConfirmationPage.clickContinueToRemovePublication();
      expect(await removePublicationSuccessPage.getPanelTitle()).toEqual('Success');
    });
    it('should click on the home link and open admin dashboard page', async () => {
      adminDashboard = await removePublicationSuccessPage.clickHome();
      expect(await adminDashboard.getPageTitle()).toEqual('Your Dashboard');
    });
  });

  describe('Manage media account requests journey', () => {
    before(async () => {
      await adminDashboard.open('/admin-dashboard');
    });
    it('should start the manage media account request journey', async () => {
      mediaAccountRequestsPage = await adminDashboard.clickManageMedia();
      expect(await mediaAccountRequestsPage.getPageTitle()).toEqual('Select application to assess');
    });

    it('should select view application', async () => {
      mediaAccountReviewPage = await mediaAccountRequestsPage.clickViewApplication();
      expect(await mediaAccountReviewPage.getPageTitle()).toEqual('Applicant\'s details');
    });

    it('should click approve application', async () => {
      mediaAccountApprovalPage = await mediaAccountReviewPage.clickApproveApplication();
      expect(await mediaAccountApprovalPage.getPageTitle()).toEqual('Are you sure you want to approve this application?');
    });

    it('should select no to approve application', async () => {
      await mediaAccountApprovalPage.selectNo();
      mediaAccountReviewPage = await mediaAccountApprovalPage.clickContinue();
      expect(await mediaAccountReviewPage.getPageTitle()).toEqual('Applicant\'s details');
    });

    it('should select reject application', async () => {
      mediaAccountRejectionPage = await mediaAccountReviewPage.clickRejectApplication();
      expect(await mediaAccountRejectionPage.getPageTitle()).toEqual('Are you sure you want to reject this application?');
    });

    it('should select yes to reject application', async () => {
      await mediaAccountRejectionPage.selectYes();
      mediaAccountRejectionConfirmationPage = await mediaAccountRejectionPage.clickContinue();
      expect(await mediaAccountRejectionConfirmationPage.getPanelTitle()).toEqual('Account has been rejected');
    });
  });

  describe('sign out admin dashboard', () => {
    before(async () => {
      await adminDashboard.open('admin-dashboard');
    });
    it('should sign out and open session-logged-out page', async () => {
      sessionLoggedOutPage = await adminDashboard.clickSignOut();
      expect(await sessionLoggedOutPage.getPageTitle()).toEqual('You have been signed out');
    });
  });
});

describe('System Admin level journeys', () => {

  it('should open Admin Login page', async () => {
    await signInPage.open('/admin-login?p=B2C_1_SignInAdminUserFlow');
    await signInPage.enterText(process.env.B2C_SYSTEM_ADMIN_USERNAME, 'EmailField');
    await signInPage.enterText(process.env.B2C_SYSTEM_ADMIN_PASSWORD, 'PasswordField');
    systemAdminDashboard = await signInPage.clickSystemAdminSignIn();
  });

  it('should open admin dashboard page on successful sign in', async () => {
    expect(await systemAdminDashboard.getPageTitle()).toEqual('System Admin Dashboard');
  });

  describe('Create new system admin account', () => {

    it('should click on the create new account card', async () => {
      createSystemAdminAccountPage = await systemAdminDashboard.clickCreateNewAccountCard();
      expect(await createSystemAdminAccountPage.getPageTitle()).toEqual('Create system admin account');
    });

    it('should complete form and open summary page', async () => {
      await createSystemAdminAccountPage.completeForm();
      createSystemAdminAccountSummaryPage = await createSystemAdminAccountPage.clickContinue();
      expect(await createSystemAdminAccountSummaryPage.getPageTitle()).toEqual('Check account details');
    });
  });

  describe('Reference Manual Upload', () => {
    before(async () => {
      await systemAdminDashboard.open('/system-admin-dashboard');
    });

    it('should open reference manual upload page', async () => {
      manualReferenceDataUploadPage = await systemAdminDashboard.clickReferenceDataUploadFileCard();
      expect(await manualReferenceDataUploadPage.getPageTitle()).toEqual('Reference manual data upload');
    });
    it('should complete form and open summary page', async () => {
      await manualReferenceDataUploadPage.completeForm();
      manualReferenceDataUploadSummaryPage = await manualReferenceDataUploadPage.clickContinue();
      expect(await manualReferenceDataUploadSummaryPage.getPageTitle()).toEqual('Check upload details');
    });
    it('should open upload confirmation page', async () => {
      fileUploadConfirmationPage = await manualReferenceDataUploadSummaryPage.clickContinue();
      expect(await fileUploadConfirmationPage.getPanelTitle()).toEqual('Success');
    });
  });

  describe('should open blob view locations page', async () => {
    before(async () => {
      await systemAdminDashboard.open('/system-admin-dashboard?lng=en');
    });
    it('should load the blob view locations page', async () => {
      blobViewLocationsPage = await systemAdminDashboard.clickBlobExplorerLocationsCard();
      expect(await blobViewLocationsPage.getPageTitle()).toEqual('Blob Explorer - Locations');
    });
    it('should choose the first result', async() => {
      blobViewPublicationsPage = await blobViewLocationsPage.selectFirstListResult();
      expect(await blobViewPublicationsPage.getPageTitle()).toEqual('Blob Explorer - Publications');
    });
  });

  describe('sign out system admin dashboard', () => {
    before(async () => {
      await systemAdminDashboard.open('system-admin-dashboard');
    });
    it('should sign out and open session-logged-out page', async () => {
      sessionLoggedOutPage = await systemAdminDashboard.clickSignOut();
      expect(await sessionLoggedOutPage.getPageTitle()).toEqual('You have been signed out');
    });
  });
});
