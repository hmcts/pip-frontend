import { Application } from 'express';
import fileErrorHandlerMiddleware from '../middlewares/fileErrorHandler.middleware';
import {
    isPermittedAnyRole,
    isPermittedAdmin,
    isPermittedMedia,
    isPermittedMediaAccount,
    isPermittedAccountCreation,
    isPermittedManualUpload,
    isPermittedSystemAdmin,
    forgotPasswordRedirect,
    mediaVerificationHandling,
    processAdminAccountSignIn,
    processMediaAccountSignIn,
    processCftIdamSignIn,
    checkPasswordReset,
    mapAzureLanguage,
    keepSessionLanguage,
    regenerateSession,
} from '../authentication/authenticationHandler';
import { SessionManagementService } from '../service/SessionManagementService';
import { urlPath } from '../helpers/envUrls';
import { getInfo } from '../helpers/infoProvider';
import passport from 'passport';
import healthcheck from '@hmcts/nodejs-healthcheck';
import multer from 'multer';

const sessionManagement = new SessionManagementService();

export default function (app: Application): void {
    const storage = multer.diskStorage({
        destination: 'manualUpload/tmp/',
        filename: function (_req, file, callback) {
            callback(null, file.originalname);
        },
        limits: {
            fileSize: 2000000,
        },
    });
    const fileUploadOptions = { storage: storage, limits: { fileSize: 2000000 } };

    const fileSizeLimitErrorHandler = (err, req, res, next): any => {
        fileErrorHandlerMiddleware(err, req, res, next);
    };

    function extraLanguageArg(req): object {
        return { ui_locales: mapAzureLanguage(req['lng']) };
    }

    function globalAuthGiver(req, res, next): void {
        if (sessionManagement.handleSessionExpiry(req, res)) {
            return;
        }

        next();
    }

    function reRenderView(req, res): void {
        return req.url
            ? res.render(urlPath(req.url), req.i18n.getDataByLanguage(req.lng)[urlPath(req.url)])
            : res.redirect('/not-found');
    }

    // Public paths
    app.get('/*', globalAuthGiver);
    app.post('/*', globalAuthGiver);
    app.get('/', app.locals.container.cradle.homeController.get);
    app.get('/accessibility-statement', app.locals.container.cradle.accessibilityStatementController.get);
    app.get('/account-request-submitted', app.locals.container.cradle.mediaAccountRequestSubmittedController.get);
    app.get('/alphabetical-search', (req, res) =>
        app.locals.container.cradle.alphabeticalSearchController.get(req, res, 'alphabetical-search')
    );
    app.post('/alphabetical-search', (req, res) =>
        app.locals.container.cradle.alphabeticalSearchController.post(req, res, 'alphabetical-search')
    );
    app.get('/cookie-policy', app.locals.container.cradle.cookiePolicyPageController.get);
    app.get('/create-media-account', app.locals.container.cradle.createMediaAccountController.get);
    app.post(
        '/create-media-account',
        multer({ storage: storage, limits: { fileSize: 2000000 } }).single('file-upload'),
        fileSizeLimitErrorHandler,
        app.locals.container.cradle.createMediaAccountController.post
    );
    app.post(
        '/password-change-confirmation/:isAdmin',
        checkPasswordReset,
        app.locals.container.cradle.passwordChangeController.post
    );
    app.get('/cancelled-password-reset/:isAdmin', app.locals.container.cradle.cancelledPasswordResetController.get);
    app.get('/admin-rejected-login', app.locals.container.cradle.adminRejectedLoginController.get);
    app.get('/media-rejected-login', app.locals.container.cradle.mediaRejectedLoginController.get);
    app.get('/media-verification', regenerateSession, keepSessionLanguage, (req, res, next) =>
        passport.authenticate('media-verification', {
            failureRedirect: '/',
            extraAuthReqQueryParams: extraLanguageArg(req),
        })(req, res, next)
    );
    app.get('/login', regenerateSession, keepSessionLanguage, (req, res, next) =>
        passport.authenticate('login', { failureRedirect: '/', extraAuthReqQueryParams: extraLanguageArg(req) })(
            req,
            res,
            next
        )
    );
    app.get('/admin-login', regenerateSession, keepSessionLanguage, (req, res, next) =>
        passport.authenticate('admin-login', { failureRedirect: '/', extraAuthReqQueryParams: extraLanguageArg(req) })(
            req,
            res,
            next
        )
    );
    app.get('/logout', (_req, res) => sessionManagement.logOut(_req, res, false));
    app.post(
        '/login/return',
        forgotPasswordRedirect,
        (req, res, next) =>
            passport.authenticate('login', {
                failureRedirect: '/view-option',
                extraAuthReqQueryParams: extraLanguageArg(req),
            })(req, res, next),
        keepSessionLanguage,
        processMediaAccountSignIn
    );
    app.post(
        '/login/admin/return',
        forgotPasswordRedirect,
        (req, res, next) =>
            passport.authenticate('admin-login', {
                failureRedirect: '/view-option',
                extraAuthReqQueryParams: extraLanguageArg(req),
            })(req, res, next),
        keepSessionLanguage,
        processAdminAccountSignIn
    );
    app.post(
        '/media-verification/return',
        forgotPasswordRedirect,
        (req, res, next) =>
            passport.authenticate('media-verification', {
                failureRedirect: '/view-option',
                extraAuthReqQueryParams: extraLanguageArg(req),
            })(req, res, next),
        keepSessionLanguage,
        mediaVerificationHandling
    );
    app.get('/session-expiring', isPermittedAnyRole, app.locals.container.cradle.sessionExpiringController.get);
    app.get('/session-expired', app.locals.container.cradle.sessionExpiredController.get);
    app.get('/session-expired-logout', (_req, res) => sessionManagement.logOut(_req, res, false, true));
    app.get('/session-logged-out', app.locals.container.cradle.sessionLoggedOutController.get);
    app.get('/not-found', app.locals.container.cradle.notFoundPageController.get);

    app.get('/search', app.locals.container.cradle.searchController.get);
    app.post('/search', app.locals.container.cradle.searchController.post);
    app.get('/sign-in', app.locals.container.cradle.signInController.get);
    app.post('/sign-in', app.locals.container.cradle.signInController.post);
    app.get('/view-option', app.locals.container.cradle.viewOptionController.get);
    app.post('/view-option', app.locals.container.cradle.viewOptionController.post);
    app.get('/summary-of-publications', app.locals.container.cradle.summaryOfPublicationsController.get);
    app.get('/file-publication', app.locals.container.cradle.flatFileController.get);

    // List Templates
    app.get('/sjp-public-list', app.locals.container.cradle.sjpPublicListController.get);
    app.post('/sjp-public-list', app.locals.container.cradle.sjpPublicListController.filterValues);
    app.get('/sjp-public-list-new-cases', app.locals.container.cradle.sjpPublicListController.get);
    app.post('/sjp-public-list-new-cases', app.locals.container.cradle.sjpPublicListController.filterValues);
    app.get('/sjp-press-list', app.locals.container.cradle.sjpPressListController.get);
    app.post('/sjp-press-list', app.locals.container.cradle.sjpPressListController.filterValues);
    app.get('/sjp-press-list-new-cases', app.locals.container.cradle.sjpPressListController.get);
    app.post('/sjp-press-list-new-cases', app.locals.container.cradle.sjpPressListController.filterValues);
    app.get('/civil-and-family-daily-cause-list', (req, res) =>
        app.locals.container.cradle.dailyCauseListController.get(req, res, 'civil-and-family-daily-cause-list')
    );
    app.get('/crown-daily-list', app.locals.container.cradle.crownDailyListController.get);
    app.get('/crown-firm-list', app.locals.container.cradle.crownFirmListController.get);
    app.get('/crown-warned-list', app.locals.container.cradle.crownWarnedListController.get);
    app.get('/daily-cause-list', (req, res) =>
        app.locals.container.cradle.dailyCauseListController.get(req, res, 'daily-cause-list')
    );
    app.get('/family-daily-cause-list', (req, res) =>
        app.locals.container.cradle.dailyCauseListController.get(req, res, 'family-daily-cause-list')
    );
    app.get('/sscs-daily-list', app.locals.container.cradle.sscsDailyListController.get);
    app.get('/sscs-daily-list-additional-hearings', app.locals.container.cradle.sscsDailyListController.get);
    app.get('/cop-daily-cause-list', app.locals.container.cradle.copDailyCauseListController.get);
    app.get('/et-daily-list', app.locals.container.cradle.etDailyListController.get);
    app.get('/et-fortnightly-list', app.locals.container.cradle.etFortnightlyListController.get);
    app.get('/iac-daily-list', app.locals.container.cradle.iacDailyListController.get);
    app.get('/iac-daily-list-additional-cases', app.locals.container.cradle.iacDailyListController.get);
    app.get('/primary-health-list', (req, res) =>
        app.locals.container.cradle.tribunalNationalListsController.get(req, res, 'primary-health-list')
    );
    app.get('/care-standards-list', (req, res) =>
        app.locals.container.cradle.tribunalNationalListsController.get(req, res, 'care-standards-list')
    );
    app.get('/magistrates-public-list', app.locals.container.cradle.magistratesPublicListController.get);
    app.get('/magistrates-standard-list', app.locals.container.cradle.magistratesStandardListController.get);
    app.get('/opa-press-list', app.locals.container.cradle.opaPressListController.get);
    app.get('/opa-public-list', app.locals.container.cradle.opaPublicListController.get);
    app.get('/opa-results', app.locals.container.cradle.opaResultsController.get);

    // Restricted paths
    app.get('/account-home', isPermittedMedia, app.locals.container.cradle.accountHomeController.get);
    app.get('/bulk-unsubscribe', isPermittedMedia, app.locals.container.cradle.bulkUnsubscribeController.get);
    app.post('/bulk-unsubscribe', isPermittedMedia, app.locals.container.cradle.bulkUnsubscribeController.post);
    app.get(
        '/bulk-unsubscribe-confirmation',
        isPermittedMedia,
        app.locals.container.cradle.bulkUnsubscribeConfirmationController.get
    );
    app.post(
        '/bulk-unsubscribe-confirmation',
        isPermittedMedia,
        app.locals.container.cradle.bulkUnsubscribeConfirmationController.post
    );
    app.get(
        '/bulk-unsubscribe-confirmed',
        isPermittedMedia,
        app.locals.container.cradle.bulkUnsubscribeConfirmedController.get
    );
    app.get('/case-name-search', isPermittedMedia, app.locals.container.cradle.caseNameSearchController.get);
    app.post('/case-name-search', isPermittedMedia, app.locals.container.cradle.caseNameSearchController.post);
    app.get(
        '/case-name-search-results',
        isPermittedMedia,
        app.locals.container.cradle.caseNameSearchResultsController.get
    );
    app.post(
        '/case-name-search-results',
        isPermittedMedia,
        app.locals.container.cradle.caseNameSearchResultsController.post
    );
    app.get(
        '/case-reference-number-search',
        isPermittedMedia,
        app.locals.container.cradle.caseReferenceNumberSearchController.get
    );
    app.post(
        '/case-reference-number-search',
        isPermittedMedia,
        app.locals.container.cradle.caseReferenceNumberSearchController.post
    );
    app.get(
        '/case-reference-number-search-results',
        isPermittedMedia,
        app.locals.container.cradle.caseReferenceNumberSearchResultController.get
    );
    app.post(
        '/case-reference-number-search-results',
        isPermittedMedia,
        app.locals.container.cradle.caseReferenceNumberSearchResultController.post
    );
    app.get('/delete-subscription', isPermittedMedia, app.locals.container.cradle.deleteSubscriptionController.get);
    app.get(
        '/list-download-disclaimer',
        isPermittedMedia,
        app.locals.container.cradle.listDownloadDisclaimerController.get
    );
    app.post(
        '/list-download-disclaimer',
        isPermittedMedia,
        app.locals.container.cradle.listDownloadDisclaimerController.post
    );
    app.get('/list-download-files', isPermittedMedia, app.locals.container.cradle.listDownloadFilesController.get);
    app.get('/location-name-search', isPermittedMedia, (req, res) =>
        app.locals.container.cradle.alphabeticalSearchController.get(req, res, 'location-name-search')
    );
    app.post('/location-name-search', isPermittedMedia, (req, res) =>
        app.locals.container.cradle.alphabeticalSearchController.post(req, res, 'location-name-search')
    );
    app.post(
        '/location-subscriptions-confirmation',
        isPermittedMedia,
        app.locals.container.cradle.alphabeticalSearchController.locationSubscriptionsConfirmation
    );
    app.get('/pending-subscriptions', isPermittedMedia, app.locals.container.cradle.pendingSubscriptionsController.get);
    app.post(
        '/pending-subscriptions',
        isPermittedMedia,
        app.locals.container.cradle.pendingSubscriptionsController.post
    );
    app.get(
        '/remove-subscription',
        isPermittedMedia,
        app.locals.container.cradle.pendingSubscriptionsController.removeSubscription
    );
    app.get('/subscription-confirmation-preview', isPermittedMedia, app.locals.container.cradle.subscriptionConfirmationPreviewController.get);
    app.post(
        '/subscription-confirmation-preview',
        isPermittedMedia,
        app.locals.container.cradle.subscriptionConfirmationPreviewController.post
    );
    app.get(
        '/remove-pending-subscription',
        isPermittedMedia,
        app.locals.container.cradle.subscriptionConfirmationPreviewController.removePendingSubscription
    );
    app.get('/subscription-add', isPermittedMedia, app.locals.container.cradle.subscriptionAddController.get);
    app.post('/subscription-add', isPermittedMedia, app.locals.container.cradle.subscriptionAddController.post);
    app.get(
        '/subscription-management',
        isPermittedMedia,
        app.locals.container.cradle.subscriptionManagementController.get
    );
    app.get('/subscription-add-list', isPermittedMedia, app.locals.container.cradle.subscriptionAddListController.get);
    app.post(
        '/subscription-add-list',
        isPermittedMedia,
        app.locals.container.cradle.subscriptionAddListController.post
    );
    app.get(
        '/subscription-add-list-language',
        isPermittedMedia,
        app.locals.container.cradle.subscriptionAddListLanguageController.get
    );
    app.post(
        '/subscription-add-list-language',
        isPermittedMedia,
        app.locals.container.cradle.subscriptionAddListLanguageController.post
    );
    app.get('/subscription-confirmed', isPermittedMedia, reRenderView);
    app.get(
        '/subscription-configure-list',
        isPermittedMedia,
        app.locals.container.cradle.subscriptionConfigureListController.get
    );
    app.post(
        '/subscription-configure-list',
        isPermittedMedia,
        app.locals.container.cradle.subscriptionConfigureListController.post
    );
    app.get(
        '/subscription-configure-list-language',
        isPermittedMedia,
        app.locals.container.cradle.subscriptionConfigureListLanguageController.get
    );
    app.post(
        '/subscription-configure-list-language',
        isPermittedMedia,
        app.locals.container.cradle.subscriptionConfigureListLanguageController.post
    );
    app.get('/subscription-configure-list-preview',
        isPermittedMedia,
        app.locals.container.cradle.subscriptionConfigureListPreviewController.get);
    app.post(
        '/subscription-configure-list-preview',
        isPermittedMedia,
        app.locals.container.cradle.subscriptionConfigureListPreviewController.post
    );
    app.get(
        '/remove-configure-list',
        isPermittedMedia,
        app.locals.container.cradle.subscriptionConfigureListPreviewController.removeConfigureList
    );
    app.get('/subscription-configure-list-confirmed', isPermittedMedia, reRenderView);
    app.get('/unsubscribe-confirmation', isPermittedMedia, reRenderView);
    app.post(
        '/unsubscribe-confirmation',
        isPermittedMedia,
        app.locals.container.cradle.unsubscribeConfirmationController.post
    );

    // restricted admin paths
    app.get('/admin-dashboard', isPermittedAdmin, app.locals.container.cradle.adminDashboardController.get);
    app.get(
        '/create-admin-account',
        isPermittedAccountCreation,
        app.locals.container.cradle.createAdminAccountController.get
    );
    app.post(
        '/create-admin-account',
        isPermittedAccountCreation,
        app.locals.container.cradle.createAdminAccountController.post
    );
    app.get(
        '/create-admin-account-summary',
        isPermittedAccountCreation,
        app.locals.container.cradle.createAdminAccountSummaryController.get
    );
    app.post(
        '/create-admin-account-summary',
        isPermittedAccountCreation,
        app.locals.container.cradle.createAdminAccountSummaryController.post
    );
    app.get('/manual-upload', isPermittedManualUpload, app.locals.container.cradle.manualUploadController.get);
    app.post(
        '/manual-upload',
        isPermittedManualUpload,
        multer(fileUploadOptions).single('manual-file-upload'),
        fileSizeLimitErrorHandler,
        app.locals.container.cradle.manualUploadController.post
    );
    app.get(
        '/manual-upload-summary',
        isPermittedManualUpload,
        app.locals.container.cradle.manualUploadSummaryController.get
    );
    app.post(
        '/manual-upload-summary',
        isPermittedManualUpload,
        app.locals.container.cradle.manualUploadSummaryController.post
    );
    app.get(
        '/manual-upload-confirmation',
        isPermittedManualUpload,
        app.locals.container.cradle.manualUploadConfirmationController.get
    );
    app.get(
        '/media-applications',
        isPermittedMediaAccount,
        app.locals.container.cradle.mediaApplicationsController.get
    );
    app.get(
        '/media-account-review',
        isPermittedMediaAccount,
        app.locals.container.cradle.mediaAccountReviewController.get
    );
    app.get(
        '/media-account-review/image',
        isPermittedMediaAccount,
        app.locals.container.cradle.mediaAccountReviewController.getImage
    );
    app.post(
        '/media-account-review/approve',
        isPermittedMediaAccount,
        app.locals.container.cradle.mediaAccountReviewController.approve
    );
    app.post(
        '/media-account-review/reject',
        isPermittedMediaAccount,
        app.locals.container.cradle.mediaAccountReviewController.reject
    );
    app.get(
        '/media-account-approval',
        isPermittedMediaAccount,
        app.locals.container.cradle.mediaAccountApprovalController.get
    );
    app.post(
        '/media-account-approval',
        isPermittedMediaAccount,
        app.locals.container.cradle.mediaAccountApprovalController.post
    );
    app.get(
        '/media-account-approval-confirmation',
        isPermittedMediaAccount,
        app.locals.container.cradle.mediaAccountApprovalConfirmationController.get
    );
    app.get(
        '/media-account-rejection',
        isPermittedMediaAccount,
        app.locals.container.cradle.mediaAccountRejectionController.get
    );
    app.post(
        '/media-account-rejection',
        isPermittedMediaAccount,
        app.locals.container.cradle.mediaAccountRejectionController.post
    );
    app.get(
        '/media-account-rejection-reasons',
        isPermittedMediaAccount,
        app.locals.container.cradle.mediaAccountRejectionReasonsController.get
    );
    app.post(
        '/media-account-rejection-reasons',
        isPermittedMediaAccount,
        app.locals.container.cradle.mediaAccountRejectionReasonsController.post
    );
    app.get(
        '/media-account-rejection-confirmation',
        isPermittedMediaAccount,
        app.locals.container.cradle.mediaAccountRejectionConfirmationController.get
    );

    app.get(
        '/remove-list-confirmation',
        isPermittedManualUpload,
        app.locals.container.cradle.removeListConfirmationController.get
    );
    app.post(
        '/remove-list-confirmation',
        isPermittedManualUpload,
        app.locals.container.cradle.removeListConfirmationController.post
    );
    app.get('/remove-list-search', isPermittedManualUpload, (req, res) =>
        app.locals.container.cradle.removeListSearchController.get(req, res)
    );
    app.post('/remove-list-search', isPermittedManualUpload, (req, res) =>
        app.locals.container.cradle.removeListSearchController.post(req, res)
    );
    app.get(
        '/remove-list-search-results',
        isPermittedManualUpload,
        app.locals.container.cradle.removeListSearchResultsController.get
    );
    app.post(
        '/remove-list-search-results',
        isPermittedManualUpload,
        app.locals.container.cradle.removeListSearchResultsController.post
    );
    app.get(
        '/remove-list-success',
        isPermittedManualUpload,
        app.locals.container.cradle.removeListSuccessController.get
    );
    app.get('/admin-management', isPermittedAccountCreation, app.locals.container.cradle.adminManagementController.get);
    app.post(
        '/admin-management',
        isPermittedAccountCreation,
        app.locals.container.cradle.adminManagementController.post
    );
    app.get('/manage-user', isPermittedAccountCreation, app.locals.container.cradle.manageUserController.get);
    app.get('/update-user', isPermittedAccountCreation, app.locals.container.cradle.updateUserController.get);
    app.post('/update-user', isPermittedAccountCreation, app.locals.container.cradle.updateUserController.post);
    app.get('/delete-user', isPermittedAccountCreation, app.locals.container.cradle.deleteUserController.get);
    app.post(
        '/delete-user-confirmation',
        isPermittedAccountCreation,
        app.locals.container.cradle.deleteUserConfirmationController.post
    );

    //system-admin-restricted-paths
    app.get(
        '/system-admin-dashboard',
        isPermittedSystemAdmin,
        app.locals.container.cradle.systemAdminDashboardController.get
    );
    app.get(
        '/create-system-admin-account',
        isPermittedSystemAdmin,
        app.locals.container.cradle.createSystemAdminAccountController.get
    );
    app.post(
        '/create-system-admin-account',
        isPermittedSystemAdmin,
        app.locals.container.cradle.createSystemAdminAccountController.post
    );
    app.get(
        '/create-system-admin-account-summary',
        isPermittedSystemAdmin,
        app.locals.container.cradle.createSystemAdminAccountSummaryController.get
    );
    app.post(
        '/create-system-admin-account-summary',
        isPermittedSystemAdmin,
        app.locals.container.cradle.createSystemAdminAccountSummaryController.post
    );
    app.get('/blob-view-locations', isPermittedSystemAdmin, app.locals.container.cradle.blobViewLocationController.get);
    app.get(
        '/blob-view-publications',
        isPermittedSystemAdmin,
        app.locals.container.cradle.blobViewPublicationsController.get
    );
    app.get('/blob-view-json', isPermittedSystemAdmin, app.locals.container.cradle.blobViewJsonController.get);
    app.get(
        '/bulk-create-media-accounts',
        isPermittedSystemAdmin,
        app.locals.container.cradle.bulkCreateMediaAccountsController.get
    );
    app.post(
        '/bulk-create-media-accounts',
        isPermittedSystemAdmin,
        multer(fileUploadOptions).single('bulk-account-upload'),
        fileSizeLimitErrorHandler,
        app.locals.container.cradle.bulkCreateMediaAccountsController.post
    );
    app.get(
        '/bulk-create-media-accounts-confirmation',
        isPermittedSystemAdmin,
        app.locals.container.cradle.bulkCreateMediaAccountsConfirmationController.get
    );
    app.post(
        '/bulk-create-media-accounts-confirmation',
        isPermittedSystemAdmin,
        app.locals.container.cradle.bulkCreateMediaAccountsConfirmationController.post
    );
    app.get(
        '/bulk-create-media-accounts-confirmed',
        isPermittedSystemAdmin,
        app.locals.container.cradle.bulkCreateMediaAccountsConfirmedController.get
    );
    app.get(
        '/reference-data-upload',
        isPermittedSystemAdmin,
        app.locals.container.cradle.referenceDataUploadController.get
    );
    app.post(
        '/reference-data-upload',
        isPermittedSystemAdmin,
        multer(fileUploadOptions).single('reference-data-upload'),
        fileSizeLimitErrorHandler,
        app.locals.container.cradle.referenceDataUploadController.post
    );
    app.get(
        '/reference-data-upload-summary',
        isPermittedSystemAdmin,
        app.locals.container.cradle.referenceDataUploadSummaryController.get
    );
    app.post(
        '/reference-data-upload-summary',
        isPermittedSystemAdmin,
        app.locals.container.cradle.referenceDataUploadSummaryController.post
    );
    app.get(
        '/reference-data-upload-confirmation',
        isPermittedSystemAdmin,
        app.locals.container.cradle.referenceDataUploadConfirmationController.get
    );
    app.get(
        '/manual-reference-data-download',
        isPermittedSystemAdmin,
        app.locals.container.cradle.referenceDataDownloadController.get
    );
    app.get(
        '/manage-third-party-users',
        isPermittedSystemAdmin,
        app.locals.container.cradle.manageThirdPartyUsersController.get
    );
    app.get(
        '/manage-third-party-users/view',
        isPermittedSystemAdmin,
        app.locals.container.cradle.manageThirdPartyUsersViewController.get
    );
    app.get(
        '/manage-third-party-users/subscriptions',
        isPermittedSystemAdmin,
        app.locals.container.cradle.manageThirdPartyUsersSubscriptionsController.get
    );
    app.post(
        '/manage-third-party-users/subscriptions',
        isPermittedSystemAdmin,
        app.locals.container.cradle.manageThirdPartyUsersSubscriptionsController.post
    );
    app.get(
        '/create-third-party-user',
        isPermittedSystemAdmin,
        app.locals.container.cradle.createThirdPartyUserController.get
    );
    app.post(
        '/create-third-party-user',
        isPermittedSystemAdmin,
        app.locals.container.cradle.createThirdPartyUserController.post
    );
    app.get(
        '/create-third-party-user-summary',
        isPermittedSystemAdmin,
        app.locals.container.cradle.createThirdPartyUserSummaryController.get
    );
    app.post(
        '/create-third-party-user-summary',
        isPermittedSystemAdmin,
        app.locals.container.cradle.createThirdPartyUserSummaryController.post
    );
    app.get(
        '/create-third-party-user-success',
        isPermittedSystemAdmin,
        app.locals.container.cradle.createThirdPartyUserSuccessController.get
    );
    app.get(
        '/delete-third-party-user-confirmation',
        isPermittedSystemAdmin,
        app.locals.container.cradle.deleteThirdPartyUserConfirmationController.get
    );
    app.post(
        '/delete-third-party-user-confirmation',
        isPermittedSystemAdmin,
        app.locals.container.cradle.deleteThirdPartyUserConfirmationController.post
    );
    app.get(
        '/delete-third-party-user-success',
        isPermittedSystemAdmin,
        app.locals.container.cradle.deleteThirdPartyUserSuccessController.get
    );
    app.get('/user-management', isPermittedSystemAdmin, app.locals.container.cradle.userManagementController.get);
    app.post('/user-management', isPermittedSystemAdmin, app.locals.container.cradle.userManagementController.post);

    app.get('/delete-court-reference-data', isPermittedSystemAdmin, (req, res) =>
        app.locals.container.cradle.deleteCourtReferenceDataController.get(req, res)
    );
    app.post('/delete-court-reference-data', isPermittedSystemAdmin, (req, res) =>
        app.locals.container.cradle.deleteCourtReferenceDataController.post(req, res)
    );
    app.get('/delete-court-reference-data-confirmation', isPermittedSystemAdmin, (req, res) =>
        app.locals.container.cradle.deleteCourtReferenceDataConfirmationController.get(
            req,
            res,
            'delete-court-reference-data-confirmation'
        )
    );
    app.post(
        '/delete-court-reference-data-confirmation',
        isPermittedSystemAdmin,
        app.locals.container.cradle.deleteCourtReferenceDataConfirmationController.post
    );
    app.get(
        '/delete-court-reference-data-success',
        isPermittedSystemAdmin,
        app.locals.container.cradle.deleteCourtReferenceDataSuccessController.get
    );
    app.get('/delete-court-subscription-confirmation', isPermittedSystemAdmin, (req, res) =>
        app.locals.container.cradle.deleteCourtReferenceDataConfirmationController.get(
            req,
            res,
            'delete-court-subscription-confirmation'
        )
    );
    app.post('/delete-court-subscription-confirmation', isPermittedSystemAdmin, (req, res) =>
        app.locals.container.cradle.deleteCourtSubscriptionConfirmationController.post(
            req,
            res,
            'delete-court-subscription-confirmation'
        )
    );
    app.get('/delete-court-subscription-success', isPermittedSystemAdmin, (req, res) =>
        app.locals.container.cradle.deleteCourtSubscriptionSuccessController.get(
            req,
            res,
            'delete-court-subscription-success'
        )
    );
    app.get('/delete-court-publication-confirmation', isPermittedSystemAdmin, (req, res) =>
        app.locals.container.cradle.deleteCourtReferenceDataConfirmationController.get(
            req,
            res,
            'delete-court-publication-confirmation'
        )
    );
    app.post('/delete-court-publication-confirmation', isPermittedSystemAdmin, (req, res) =>
        app.locals.container.cradle.deleteCourtSubscriptionConfirmationController.post(
            req,
            res,
            'delete-court-publication-confirmation'
        )
    );
    app.get('/delete-court-publication-success', isPermittedSystemAdmin, (req, res) =>
        app.locals.container.cradle.deleteCourtSubscriptionSuccessController.get(
            req,
            res,
            'delete-court-publication-success'
        )
    );
    app.get('/audit-log-viewer', isPermittedSystemAdmin, app.locals.container.cradle.auditLogViewerController.get);
    app.get('/audit-log-details', isPermittedSystemAdmin, app.locals.container.cradle.auditLogDetailsController.get);

    //CFT Routes
    app.get('/cft-login', regenerateSession, keepSessionLanguage, app.locals.container.cradle.cftLoginController.get);
    app.get(
        '/cft-login/return',
        passport.authenticate('cft-idam', {
            failureRedirect: '/cft-rejected-login',
        }),
        keepSessionLanguage,
        processCftIdamSignIn
    );
    app.get('/cft-rejected-login', app.locals.container.cradle.cftRejectedLoginController.get);

    app.get('/info', getInfo());
    app.get('/robots.txt', function (_req, res) {
        res.type('text/plain');
        res.send('User-agent: *\nDisallow: /');
    });

    const healthCheckConfig = {
        checks: {
            // TODO: replace this sample check with proper checks for your application
            sampleCheck: healthcheck.raw(() => healthcheck.up()),
        },
    };

    healthcheck.addTo(app, healthCheckConfig);
}
