import { AccountHomePage } from '../PageObjects/AccountHome.page';
import { AccountHomePage } from '../PageObjects/AccountHome.page';
import { AdminDashboardPage } from '../PageObjects/AdminDashboard.page';
import { SystemAdminDashboardPage } from '../PageObjects/SystemAdminDashboard.page';
import { AlphabeticalSearchPage } from '../PageObjects/AlphabeticalSearch.page';
import { CaseEventGlossaryPage } from '../PageObjects/CaseEventGlossary.page';
import { CreateAdminAccountPage } from '../PageObjects/CreateAdminAccount.page';
import { CreateAdminAccountSummaryPage } from '../PageObjects/CreateAdminAccountSummary.page';
import { CourtListPage } from '../PageObjects/CourtList.page';
import { HomePage } from '../PageObjects/Home.page';
import { LiveCaseCourtSearchControllerPage } from '../PageObjects/LiveCaseCourtSearchController.page';
import { LiveCaseStatusPage } from '../PageObjects/LiveCaseStatus.page';
import { SearchPage } from '../PageObjects/Search.page';
import { SignInPage } from '../PageObjects/SignIn.page';
import { SingleJusticeProcedurePage } from '../PageObjects/SingleJusticeProcedure.page';
import { SjpPublicListPage } from '../PageObjects/SjpPublicList.page';
import { SjpPressListPage } from '../PageObjects/SjpPressList.page';
import { SubscriptionManagementPage } from '../PageObjects/SubscriptionManagement.page';
import { SummaryOfPublicationsPage } from '../pageobjects/SummaryOfPublications.page';
import { ViewOptionPage } from '../PageObjects/ViewOption.page';
import { MediaAccountRequestsPage } from '../PageObjects/MediaAccountRequests.page';
import { MediaAccountReviewPage } from '../PageObjects/MediaAccountReview.page';
import { MediaAccountApprovalPage } from '../PageObjects/MediaAccountApproval.page';
import { MediaAccountRejectionPage } from '../PageObjects/MediaAccountRejection.page';
import { MediaAccountRejectionConfirmationPage } from '../PageObjects/MediaAccountRejectionConfirmation.page';
import { CreateMediaAccountPage } from '../PageObjects/CreateMediaAccount.page';
import { MediaAccountRequestSubmittedPage } from '../PageObjects/MediaAccountRequestSubmitted.page';
import { CftAuthenticationFailedPage } from '../PageObjects/CftAuthenticationFailed.page';
import { SessionLoggedOutPage } from '../PageObjects/SessionLoggedOut.page';
import { ManageThirdPartyUsersPage } from '../PageObjects/ManageThirdPartyUsers.page';
import { ListDownloadDisclaimerPage } from '../PageObjects/ListDownloadDisclaimer.page';
import { ListDownloadFilesPage } from '../PageObjects/ListDownloadFiles.page';
import { BulkCreateMediaAccountsPage } from '../pageobjects/BulkCreateMediaAccounts.page';
import { BulkCreateMediaAccountsConfirmationPage } from '../pageobjects/BulkCreateMediaAccountsConfirmation.page';
import { MediaAccountRejectionReasonsPage } from '../pageobjects/MediaAccountRejectionReasons.page';

const homePage = new HomePage();
let subscriptionManagementPage: SubscriptionManagementPage;
const liveCaseCourtSearchControllerPage = new LiveCaseCourtSearchControllerPage();
let viewOptionPage: ViewOptionPage;
let summaryOfPublicationsPage: SummaryOfPublicationsPage;
let alphabeticalSearchPage: AlphabeticalSearchPage;
let searchPage: SearchPage;
let liveCaseStatusPage: LiveCaseStatusPage;
let singleJusticeProcedurePage: SingleJusticeProcedurePage;
let caseEventGlossaryPage: CaseEventGlossaryPage;
let adminDashboard = new AdminDashboardPage();
let systemAdminDashboard = new SystemAdminDashboardPage();
let createMediaAccountPage: CreateMediaAccountPage;
let mediaAccountRequestSubmittedPage: MediaAccountRequestSubmittedPage;
let accountHomePage: AccountHomePage;
let courtListPage: CourtListPage;
let sjpPublicListPage: SjpPublicListPage;
let sjpPressListPage: SjpPressListPage;
let listDownloadDisclaimerPage: ListDownloadDisclaimerPage;
let listDownloadFilesPage: ListDownloadFilesPage;
let signInPage: SignInPage;
let createAdminAccountPage: CreateAdminAccountPage;
let createAdminAccountSummaryPage: CreateAdminAccountSummaryPage;
let mediaAccountRequestsPage: MediaAccountRequestsPage;
let mediaAccountReviewPage: MediaAccountReviewPage;
let mediaAccountApprovalPage: MediaAccountApprovalPage;
let mediaAccountRejectionPage: MediaAccountRejectionPage;
let mediaAccountRejectionReasonsPage: MediaAccountRejectionReasonsPage;
let mediaAccountRejectionConfirmationPage: MediaAccountRejectionConfirmationPage;
let cftAuthenticationFailedPage: CftAuthenticationFailedPage;
let sessionLoggedOutPage: SessionLoggedOutPage;
let manageThirdPartyUsersPage: ManageThirdPartyUsersPage;
let bulkCreateMediaAccountsPage: BulkCreateMediaAccountsPage;
let bulkCreateMediaAccountsConfirmationPage: BulkCreateMediaAccountsConfirmationPage;

const testCourt = 'AA - E2E TEST COURT - DO NOT REMOVE';

describe('Unverified user', () => {
    it("should open main page with 'See publications and information from a court or tribunal' title", async () => {
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
        it("should select 'Court or Tribunal hearing Publications' option and navigate to search option page", async () => {
            await viewOptionPage.selectOption('CourtOrTribunalRadioButton');
            searchPage = await viewOptionPage.clickContinueForSearch();
            expect(await searchPage.getPageTitle()).toEqual('What court or tribunal are you interested in?');
        });

        describe('following the search court path', async () => {
            it('should enter text and click continue', async () => {
                await searchPage.enterText(testCourt);
                summaryOfPublicationsPage = await searchPage.clickContinue();
                expect(await summaryOfPublicationsPage.getPageTitle()).toEqual(
                    'What do you want to view from ' + testCourt + '?'
                );
            });

            it('should select the first publication', async () => {
                courtListPage = await summaryOfPublicationsPage.clickSOPListItem();
                expect(await courtListPage.getPageTitle()).toContain(testCourt);
            });
        });

        describe("following the 'Select from an A-Z list of courts and tribunals' path", async () => {
            before(async () => {
                await searchPage.open('/search');
            });

            it("should click on 'Select from an A-Z list of courts and tribunals' link ", async () => {
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
                expect(await summaryOfPublicationsPage.getPageTitle()).toEqual(
                    'What do you want to view from ' + testCourt + '?'
                );
            });

            it('should select the first publication', async () => {
                courtListPage = await summaryOfPublicationsPage.clickSOPListItem();
                expect(await courtListPage.getPageTitle()).toContain(testCourt);
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
                    expect(await caseEventGlossaryPage.getPageTitle()).toEqual(
                        'Live hearing updates - glossary of terms'
                    );
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
            it("should select 'Single Justice Procedure case' option and navigate to Single Justice Procedure case page", async () => {
                await viewOptionPage.selectOption('SingleJusticeProcedureRadioButton');
                singleJusticeProcedurePage = await viewOptionPage.clickContinueSingleJusticeProcedure();
                expect(await singleJusticeProcedurePage.getPageTitle()).toEqual(
                    'What do you want to view from Single Justice Procedure?'
                );
            });

            it('should select first list item', async () => {
                sjpPublicListPage = await singleJusticeProcedurePage.clickSjpPublicListItem();
                expect(await sjpPublicListPage.getPageTitle()).toEqual(
                    'Single Justice Procedure cases that are ready for hearing'
                );
            });
        });

        describe('SJP list filtering', () => {
            before(async () => {
                await searchPage.open('/search');
            });

            it('should enter text and click continue', async () => {
                await searchPage.enterText(testCourt);
                summaryOfPublicationsPage = await searchPage.clickContinue();
                expect(await summaryOfPublicationsPage.getPageTitle()).toEqual(
                    'What do you want to view from ' + testCourt + '?'
                );
            });

            it('should select SJP press list publication with text', async () => {
                sjpPressListPage = await summaryOfPublicationsPage.clickSelectedSjpPressListItem(
                    'Single Justice Procedure Press List 01 February 2023'
                );
                expect(await sjpPressListPage.getPageTitle()).toContain('Single Justice Procedure cases - Press view');
                expect(await sjpPressListPage.summaryListItems).toBe(95);
            });

            it('should display the filters after clicking the show filters button', async () => {
                await sjpPressListPage.clickShowFiltersButton();

                expect(await sjpPressListPage.checkIfSelected('PostcodeFilter')).toBeFalsy();
                expect(await sjpPressListPage.checkIfSelected('ProsecutorFilter')).toBeFalsy();
            });

            it('should select Postcode and Prosecutor filters', async () => {
                await sjpPressListPage.selectOption('PostcodeFilter');
                await sjpPressListPage.selectOption('ProsecutorFilter');

                expect(await sjpPressListPage.checkIfSelected('PostcodeFilter')).toBeTruthy();
                expect(await sjpPressListPage.checkIfSelected('ProsecutorFilter')).toBeTruthy();
            });

            it('should click the apply filters button', async () => {
                sjpPressListPage = await sjpPressListPage.clickApplyFiltersButton();

                expect(await sjpPressListPage.checkIfSelected('PostcodeFilter')).toBeTruthy();
                expect(await sjpPressListPage.checkIfSelected('ProsecutorFilter')).toBeTruthy();

                expect(await sjpPressListPage.summaryListItems).toBe(2);
                expect(await sjpPressListPage.filteredTags).toBe(2);
            });

            it('should clear all filters', async () => {
                sjpPressListPage = await sjpPressListPage.clickClearFiltersLink();

                expect(await sjpPressListPage.checkIfSelected('PostcodeFilter')).toBeFalsy();
                expect(await sjpPressListPage.checkIfSelected('ProsecutorFilter')).toBeFalsy();
                expect(await sjpPressListPage.summaryListItems).toBe(95);
            });

            it('should re-select Postcode and Prosecutor filters then apply filters', async () => {
                await sjpPressListPage.selectOption('PostcodeFilter');
                await sjpPressListPage.selectOption('ProsecutorFilter');

                expect(await sjpPressListPage.checkIfSelected('PostcodeFilter')).toBeTruthy();
                expect(await sjpPressListPage.checkIfSelected('ProsecutorFilter')).toBeTruthy();
            });

            it('should click the apply filters button after re-selecting filters', async () => {
                sjpPressListPage = await sjpPressListPage.clickApplyFiltersButton();

                expect(await sjpPressListPage.checkIfSelected('PostcodeFilter')).toBeTruthy();
                expect(await sjpPressListPage.checkIfSelected('ProsecutorFilter')).toBeTruthy();

                expect(await sjpPressListPage.summaryListItems).toBe(2);
                expect(await sjpPressListPage.filteredTags).toBe(2);
            });

            it('should remove Postcode filter', async () => {
                sjpPressListPage = await sjpPressListPage.clickRemoveFirstFilterLink();

                expect(await sjpPressListPage.checkIfSelected('PostcodeFilter')).toBeFalsy();
                expect(await sjpPressListPage.checkIfSelected('ProsecutorFilter')).toBeTruthy();
                expect(await sjpPressListPage.summaryListItems).toBe(54);
                expect(await sjpPressListPage.filteredTags).toBe(1);
            });

            it('should remove Prosecutor filter', async () => {
                sjpPressListPage = await sjpPressListPage.clickRemoveFirstFilterLink();

                expect(await sjpPressListPage.checkIfSelected('PostcodeFilter')).toBeFalsy();
                expect(await sjpPressListPage.checkIfSelected('ProsecutorFilter')).toBeFalsy();
                expect(await sjpPressListPage.summaryListItems).toBe(95);
                expect(await sjpPressListPage.filteredTags).toBe(0);
            });

            it('should search filters for postcodes', async () => {
                await sjpPressListPage.enterTextToSearchFilters('BD1');

                expect(await sjpPressListPage.displayedFilters()).toBe(3);
            });

            it('should search filters for prosecutor', async () => {
                await sjpPressListPage.enterTextToSearchFilters('tv');

                expect(await sjpPressListPage.displayedFilters()).toBe(1);
            });
        });

        describe('sorting of list table', () => {
            before(async () => {
                await searchPage.open('/search');
            });

            it('should enter text and click continue', async () => {
                await searchPage.enterText(testCourt);
                summaryOfPublicationsPage = await searchPage.clickContinue();
                expect(await summaryOfPublicationsPage.getPageTitle()).toEqual(
                    'What do you want to view from ' + testCourt + '?'
                );
            });

            it('should select the publication with text', async () => {
                courtListPage = await summaryOfPublicationsPage.clickSelectedListItem('Primary Health');
                expect(await courtListPage.getPageTitle()).toContain('Primary Health');
            });

            it('should sort the table on ascending order', async () => {
                await courtListPage.clickFirstTableHeaderButton();
                expect(await courtListPage.getFirstTableRowFirstCell()).toEqual('10 May');
                expect(await courtListPage.getLastTableRowFirstCell()).toEqual('04 October');
            });

            it('should sort the table on descending order', async () => {
                await courtListPage.clickFirstTableHeaderButton();
                expect(await courtListPage.getFirstTableRowFirstCell()).toEqual('04 October');
                expect(await courtListPage.getLastTableRowFirstCell()).toEqual('10 May');
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
        it("should open sign-in page with 'How do you want to sign in' title", async () => {
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

describe('CFT IDAM user login', () => {
    describe('Sign in using a valid account', () => {
        it("should open sign-in page with 'How do you want to sign in' title", async () => {
            await signInPage.open('/sign-in');
            expect(await signInPage.getPageTitle()).toEqual('How do you want to sign in?');
        });

        it('should see 3 radio buttons', async () => {
            expect(await signInPage.radioButtons).toBe(3);
        });

        it("should select 'With a MyHMCTS account' option, navigate to the login page, and sign in", async () => {
            await signInPage.open('/sign-in');
            await signInPage.selectOption('SignInRadio1');
            await signInPage.clickContinueForRadio1();
            await signInPage.enterText(process.env.CFT_VALID_USERNAME, 'CftEmailField');
            await signInPage.enterText(process.env.CFT_VALID_PASSWORD, 'CftPasswordField');
            accountHomePage = await signInPage.clickSignInCft();
        });

        it('should open account home page on successful sign in', async () => {
            expect(await accountHomePage.getPageTitle()).toBe('Your account');
        });

        it('should sign out and open session logged out page', async () => {
            sessionLoggedOutPage = await accountHomePage.clickSignOutForCftAccount();
            expect(await sessionLoggedOutPage.getPanelTitle()).toEqual('You have been signed out');
        });
    });

    describe('Sign in using an invalid account', () => {
        it("should open sign-in page with 'How do you want to sign in' title", async () => {
            await signInPage.open('/sign-in');
            expect(await signInPage.getPageTitle()).toEqual('How do you want to sign in?');
        });

        it('should see 3 radio buttons', async () => {
            expect(await signInPage.radioButtons).toBe(3);
        });

        it("should select 'With a MyHMCTS account' option, navigate to the login page, and sign in", async () => {
            await signInPage.open('/sign-in');
            await signInPage.selectOption('SignInRadio1');
            await signInPage.clickContinueForRadio1();
            await signInPage.enterText(process.env.CFT_INVALID_USERNAME, 'CftEmailField');
            await signInPage.enterText(process.env.CFT_INVALID_PASSWORD, 'CftPasswordField');
            cftAuthenticationFailedPage = await signInPage.clickSignInCftUnsuccessful();
        });

        it('should open Authentication failed page', async () => {
            expect(await cftAuthenticationFailedPage.getParagraphText()).toBe(
                'You have successfully signed into your MyHMCTS account.' +
                    ' Unfortunately, your account role does not allow you to access the verified user part of the Court and tribunal hearings service'
            );
        });
    });
});

describe('Verified user', () => {
    describe('Sign In Page', () => {
        it("should open sign-in page with 'How do you want to sign in' title", async () => {
            await signInPage.open('/sign-in');
            expect(await signInPage.getPageTitle()).toEqual('How do you want to sign in?');
        });

        it('should see 3 radio buttons', async () => {
            expect(await signInPage.radioButtons).toBe(3);
        });

        describe('sign in process and page routing', async () => {
            it("should select 'Sign in With a Court and tribunal hearings account' option, navigate to the login page, and sign in", async () => {
                await signInPage.open('/sign-in');
                await signInPage.selectOption('SignInRadio3');
                await signInPage.clickContinueForRadio3();
                console.log('B2C_USERNAME', process.env.B2C_USERNAME);
                await signInPage.enterText(process.env.B2C_USERNAME, 'EmailField');
                await signInPage.enterText(process.env.B2C_PASSWORD, 'PasswordField');
                accountHomePage = await signInPage.clickSignInAad();
            });

            it('should open account home page on successful sign in', async () => {
                expect(await accountHomePage.getPageTitle()).toBe('Your account');
            });
        });
    });

    describe('SJP list download navigation', () => {
        before(async () => {
            await accountHomePage.open('account-home');
        });

        it('should navigate to the SJP list page', async () => {
            summaryOfPublicationsPage = await searchPage.clickNavSJP(true);
            expect(await summaryOfPublicationsPage.getPageTitle()).toBe(
                'What do you want to view from Single Justice Procedure?'
            );

            sjpPublicListPage = await singleJusticeProcedurePage.clickSjpPublicListItem();
            expect(await sjpPublicListPage.getPageTitle()).toEqual(
                'Single Justice Procedure cases that are ready for hearing'
            );
        });

        it('should navigate to list download disclaimer page on download button click', async () => {
            listDownloadDisclaimerPage = await sjpPublicListPage.clickDownloadACopyButton();
            expect(await listDownloadDisclaimerPage.getPageTitle()).toBe('Terms and conditions');
        });

        it('should agree to the terms and conditions and continue', async () => {
            await listDownloadDisclaimerPage.tickAgreeCheckbox();
            listDownloadFilesPage = await listDownloadDisclaimerPage.clickContinue();
            expect(await listDownloadFilesPage.getPageTitle()).toEqual('Download your file');
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
            expect(await sessionLoggedOutPage.getPanelTitle()).toEqual('You have been signed out');
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

    describe('Create new account', () => {
        it('should click on the create new account card', async () => {
            createAdminAccountPage = await adminDashboard.clickCreateNewAccountCard();
            expect(await createAdminAccountPage.getPageTitle()).toEqual('Create admin account');
        });

        it('should complete form and open summary page', async () => {
            await createAdminAccountPage.completeForm();
            createAdminAccountSummaryPage = await createAdminAccountPage.clickContinue();
            expect(await createAdminAccountSummaryPage.getPageTitle()).toEqual('Check account details');
        });

        it('should click confirm and create user account', async () => {
            createAdminAccountSummaryPage = await createAdminAccountSummaryPage.clickConfirm();
            expect(await createAdminAccountSummaryPage.getPanelTitle()).toEqual('Account has been created');
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
            expect(await mediaAccountReviewPage.getPageTitle()).toEqual("Applicant's details");
        });

        it('should click approve application', async () => {
            mediaAccountApprovalPage = await mediaAccountReviewPage.clickApproveApplication();
            expect(await mediaAccountApprovalPage.getPageTitle()).toEqual(
                'Are you sure you want to approve this application?'
            );
        });

        it('should select no to approve application', async () => {
            await mediaAccountApprovalPage.selectNo();
            mediaAccountReviewPage = await mediaAccountApprovalPage.clickContinue();
            expect(await mediaAccountReviewPage.getPageTitle()).toEqual("Applicant's details");
        });

        it('should select reject application', async () => {
            mediaAccountRejectionReasonsPage = await mediaAccountReviewPage.clickRejectApplication();
            expect(await mediaAccountRejectionReasonsPage.getFieldSetTitle()).toEqual(
                'Why are you rejecting this application?'
            );
        });

        it('should select reasons to reject application', async () => {
            await mediaAccountRejectionReasonsPage.selectReason();
            mediaAccountRejectionPage = await mediaAccountRejectionReasonsPage.clickContinue();
            expect(await mediaAccountRejectionPage.getPageTitle()).toEqual(
                'Are you sure you want to reject this application?'
            );
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
            expect(await sessionLoggedOutPage.getPanelTitle()).toEqual('You have been signed out');
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

    describe('manage third party users dashboard', () => {
        it('should open third party users page', async () => {
            manageThirdPartyUsersPage = await systemAdminDashboard.clickManageThirdPartyUsersCard();
            expect(await manageThirdPartyUsersPage.getPageTitle()).toEqual('Manage Third Party Users');
        });
    });

    describe('should open bulk create media accounts page', async () => {
        before(async () => {
            await systemAdminDashboard.open('/system-admin-dashboard');
            systemAdminDashboard.removeOverlay();
        });

        it('should load the bulk create media accounts page', async () => {
            bulkCreateMediaAccountsPage = await systemAdminDashboard.clickBulkCreateMediaAccountsCard();
            expect(await bulkCreateMediaAccountsPage.getPageTitle()).toEqual('Bulk create media accounts');
        });

        it('should upload file and open confirmation page', async () => {
            await bulkCreateMediaAccountsPage.uploadFile();
            bulkCreateMediaAccountsConfirmationPage = await bulkCreateMediaAccountsPage.clickContinue();
            expect(await bulkCreateMediaAccountsConfirmationPage.getPageTitle()).toEqual(
                'Create media accounts confirmation'
            );
        });
    });
    describe('sign out system admin dashboard', () => {
        before(async () => {
            await systemAdminDashboard.open('system-admin-dashboard');
        });
        it('should sign out and open session-logged-out page', async () => {
            sessionLoggedOutPage = await systemAdminDashboard.clickSignOut();
            expect(await sessionLoggedOutPage.getPanelTitle()).toEqual('You have been signed out');
        });
    });
});
