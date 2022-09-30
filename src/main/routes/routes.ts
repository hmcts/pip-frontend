import { Application } from 'express';
import { infoRequestHandler } from '@hmcts/info-provider';
import os from 'os';
import process from 'process';
import fileErrorHandlerMiddleware from '../middlewares/fileErrorHandler.middleware';
import {
  isPermittedAdmin,
  isPermittedMedia,
  isPermittedMediaAccount,
  isPermittedAccountCreation,
  isPermittedManualUpload,
  forgotPasswordRedirect,
  mediaVerificationHandling,
  processAdminAccountSignIn,
  processMediaAccountSignIn,
  processCftIdamSignIn,
} from '../authentication/authenticationHandler';
import {SessionManagementService} from '../service/sessionManagementService';

const passport = require('passport');
const healthcheck = require('@hmcts/nodejs-healthcheck');
const multer = require('multer');
const sessionManagement = new SessionManagementService();

export default function(app: Application): void {
  const storage = multer.diskStorage({
    destination: 'manualUpload/tmp/',
    filename: function (_req, file, callback) {
      callback(null, file.originalname);
    },
    limits: {
      fileSize: 2000000,
    },
  });

  const fileSizeLimitErrorHandler = (err, req, res, next): any => {
    fileErrorHandlerMiddleware(err, req, res, next);
  };

  function globalAuthGiver(req, res, next): void{
    if(sessionManagement.handleSessionExpiry(req, res)) {
      return;
    }

    next();
  }

  // Public paths
  app.get('/*', globalAuthGiver);
  app.post('/*', globalAuthGiver);
  app.get('/', app.locals.container.cradle.homeController.get);
  app.get('/accessibility-statement', app.locals.container.cradle.accessibilityStatementController.get);
  app.get('/account-request-submitted', app.locals.container.cradle.mediaAccountRequestSubmittedController.get);
  app.get('/alphabetical-search', app.locals.container.cradle.alphabeticalSearchController.get);
  app.post('/alphabetical-search', app.locals.container.cradle.alphabeticalSearchController.post);
  app.get('/case-event-glossary', app.locals.container.cradle.caseEventGlossaryController.get);
  app.get('/cookie-policy', app.locals.container.cradle.cookiePolicyPageController.get);
  app.get('/create-media-account', app.locals.container.cradle.createMediaAccountController.get);
  app.post('/create-media-account', multer({storage: storage, limits: {fileSize: 2000000}}).single('file-upload'), fileSizeLimitErrorHandler, app.locals.container.cradle.createMediaAccountController.post);
  app.get('/civil-and-family-daily-cause-list', app.locals.container.cradle.dailyCauseListController.get);
  app.get('/daily-cause-list', app.locals.container.cradle.dailyCauseListController.get);
  app.get('/family-daily-cause-list', app.locals.container.cradle.dailyCauseListController.get);
  app.get('/password-change-confirmation/:isAdmin', app.locals.container.cradle.passwordChangeController.get);
  app.get('/admin-rejected-login', app.locals.container.cradle.adminRejectedLoginController.get);
  app.get('/media-verification', passport.authenticate('media-verification', { failureRedirect: '/'}));
  app.get('/login', passport.authenticate('login', { failureRedirect: '/'}));
  app.get('/cft-login', app.locals.container.cradle.cftLoginController.get);
  app.get('/admin-login', passport.authenticate('admin-login', { failureRedirect: '/'}));
  app.get('/logout', (_req, res) => sessionManagement.logOut(_req, res, false));
  app.post('/login/return', forgotPasswordRedirect, passport.authenticate('login', { failureRedirect: '/view-option'}), processMediaAccountSignIn);
  app.post('/login/admin/return', forgotPasswordRedirect, passport.authenticate('admin-login', { failureRedirect: '/view-option'}), processAdminAccountSignIn);
  app.post('/media-verification/return', forgotPasswordRedirect, passport.authenticate('media-verification', { failureRedirect: '/view-option'}), mediaVerificationHandling);
  app.get('/cft-login/return', passport.authenticate('cft-idam', { failureRedirect: '/cft-rejected-login'}), processCftIdamSignIn);
  app.get('/live-case-alphabet-search', app.locals.container.cradle.liveCaseCourtSearchController.get);
  app.get('/live-case-status', app.locals.container.cradle.liveCaseStatusController.get);
  app.get('/not-found', app.locals.container.cradle.notFoundPageController.get);
  app.get('/search', app.locals.container.cradle.searchController.get);
  app.post('/search', app.locals.container.cradle.searchController.post);
  app.get('/sign-in', app.locals.container.cradle.signInController.get);
  app.post('/sign-in', app.locals.container.cradle.signInController.post);
  app.get('/view-option', app.locals.container.cradle.viewOptionController.get);
  app.post('/view-option', app.locals.container.cradle.viewOptionController.post);
  app.get('/summary-of-publications', app.locals.container.cradle.summaryOfPublicationsController.get);
  app.get('/file-publication', app.locals.container.cradle.flatFileController.get);
  app.get('/sjp-public-list', app.locals.container.cradle.sjpPublicListController.get);
  app.get('/sjp-press-list', app.locals.container.cradle.sjpPressListController.get);
  app.get('/sscs-daily-list', app.locals.container.cradle.sscsDailyListController.get);
  app.get('/cop-daily-cause-list', app.locals.container.cradle.copDailyCauseListController.get);
  app.get('/cft-rejected-login', app.locals.container.cradle.cftRejectedLoginController.get);

  // Restricted paths
  app.get('/account-home', isPermittedMedia, app.locals.container.cradle.accountHomeController.get);
  app.get('/case-name-search', isPermittedMedia, app.locals.container.cradle.caseNameSearchController.get);
  app.post('/case-name-search', isPermittedMedia, app.locals.container.cradle.caseNameSearchController.post);
  app.get('/case-name-search-results', isPermittedMedia, app.locals.container.cradle.caseNameSearchResultsController.get);
  app.get('/case-reference-number-search', isPermittedMedia, app.locals.container.cradle.caseReferenceNumberSearchController.get);
  app.post('/case-reference-number-search', isPermittedMedia, app.locals.container.cradle.caseReferenceNumberSearchController.post);
  app.get('/case-reference-number-search-results', isPermittedMedia, app.locals.container.cradle.caseReferenceNumberSearchResultController.get);
  app.get('/location-name-search', isPermittedMedia, app.locals.container.cradle.alphabeticalSearchController.get);
  app.post('/location-name-search', isPermittedMedia, app.locals.container.cradle.alphabeticalSearchController.post);
  app.get('/delete-subscription', isPermittedMedia, app.locals.container.cradle.deleteSubscriptionController.get);
  app.get('/pending-subscriptions', isPermittedMedia, app.locals.container.cradle.pendingSubscriptionsController.get);
  app.post('/pending-subscriptions', isPermittedMedia, app.locals.container.cradle.pendingSubscriptionsController.post);
  app.get('/remove-subscription', isPermittedMedia, app.locals.container.cradle.pendingSubscriptionsController.removeSubscription);
  app.get('/subscription-add', isPermittedMedia, app.locals.container.cradle.subscriptionAddController.get);
  app.post('/subscription-add', isPermittedMedia, app.locals.container.cradle.subscriptionAddController.post);
  app.post('/subscription-confirmed', isPermittedMedia, app.locals.container.cradle.subscriptionConfirmedController.post);
  app.get('/subscription-management', isPermittedMedia, app.locals.container.cradle.subscriptionManagementController.get);
  app.get('/subscription-configure-list', isPermittedMedia, app.locals.container.cradle.subscriptionConfigureListController.get);
  app.post('/subscription-configure-list', isPermittedMedia, app.locals.container.cradle.subscriptionConfigureListController.filterValues);
  app.post('/subscription-configure-list-confirmed', isPermittedMedia,
    app.locals.container.cradle.subscriptionConfigureListConfirmedController.post);
  app.get('/subscription-urn-search', isPermittedMedia, app.locals.container.cradle.subscriptionUrnSearchController.get);
  app.post('/subscription-urn-search', isPermittedMedia, app.locals.container.cradle.subscriptionUrnSearchController.post);
  app.get('/subscription-urn-search-results', isPermittedMedia, app.locals.container.cradle.subscriptionUrnSearchResultController.get);
  app.post('/unsubscribe-confirmation', isPermittedMedia, app.locals.container.cradle.unsubscribeConfirmationController.post);

  // restricted admin paths
  app.get('/admin-dashboard', isPermittedAdmin, app.locals.container.cradle.adminDashboardController.get);
  app.get('/create-admin-account', isPermittedAccountCreation, app.locals.container.cradle.createAdminAccountController.get);
  app.post('/create-admin-account', isPermittedAccountCreation, app.locals.container.cradle.createAdminAccountController.post);
  app.get('/create-admin-account-summary', isPermittedAccountCreation, app.locals.container.cradle.createAdminAccountSummaryController.get);
  app.post('/create-admin-account-summary', isPermittedAccountCreation, app.locals.container.cradle.createAdminAccountSummaryController.post);
  app.get('/manual-upload', isPermittedManualUpload, app.locals.container.cradle.manualUploadController.get);
  app.post('/manual-upload', isPermittedManualUpload, multer({storage: storage, limits: {fileSize: 2000000}}).single('manual-file-upload'), fileSizeLimitErrorHandler, app.locals.container.cradle.manualUploadController.post);
  app.get('/manual-upload-summary', isPermittedManualUpload, app.locals.container.cradle.manualUploadSummaryController.get);
  app.post('/manual-upload-summary', isPermittedManualUpload, app.locals.container.cradle.manualUploadSummaryController.post);
  app.get('/media-applications', isPermittedMediaAccount, app.locals.container.cradle.mediaApplicationsController.get);
  app.get('/upload-confirmation', isPermittedManualUpload, app.locals.container.cradle.fileUploadConfirmationController.get);
  app.get('/media-account-review', isPermittedMediaAccount, app.locals.container.cradle.mediaAccountReviewController.get);
  app.get('/media-account-review/image', isPermittedMediaAccount, app.locals.container.cradle.mediaAccountReviewController.getImage);
  app.post('/media-account-review/approve', isPermittedMediaAccount, app.locals.container.cradle.mediaAccountReviewController.approve);
  app.post('/media-account-review/reject', isPermittedMediaAccount, app.locals.container.cradle.mediaAccountReviewController.reject);
  app.get('/media-account-approval', isPermittedMediaAccount, app.locals.container.cradle.mediaAccountApprovalController.get);
  app.post('/media-account-approval', isPermittedMediaAccount, app.locals.container.cradle.mediaAccountApprovalController.post);
  app.get('/media-account-rejection', isPermittedMediaAccount, app.locals.container.cradle.mediaAccountRejectionController.get);
  app.post('/media-account-rejection', isPermittedMediaAccount, app.locals.container.cradle.mediaAccountRejectionController.post);
  app.get('/remove-list-confirmation', isPermittedManualUpload, app.locals.container.cradle.removeListConfirmationController.get);
  app.post('/remove-list-confirmation', isPermittedManualUpload, app.locals.container.cradle.removeListConfirmationController.post);
  app.get('/remove-list-search', isPermittedManualUpload, app.locals.container.cradle.removeListSearchController.get);
  app.post('/remove-list-search', isPermittedManualUpload, app.locals.container.cradle.removeListSearchController.post);
  app.get('/remove-list-search-results', isPermittedManualUpload, app.locals.container.cradle.removeListSearchResultsController.get);
  app.get('/remove-list-success', isPermittedManualUpload, app.locals.container.cradle.removeListSuccessController.get);

  app.get('/info', infoRequestHandler({
    extraBuildInfo: {
      host: os.hostname(),
      name: 'expressjs-template',
      uptime: process.uptime(),
    },
    info: {
      // TODO: add downstream info endpoints if your app has any
    },
  }));

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
