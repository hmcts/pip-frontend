import { Application, NextFunction } from 'express';
import { infoRequestHandler } from '@hmcts/info-provider';
import { Logger } from '@hmcts/nodejs-logging';
import cors  from 'cors';
import os from 'os';
import process from 'process';
import fileErrorHandlerMiddleware from '../middlewares/fileErrorHandler.middleware';

const authenticationConfig = require('../authentication/authentication-config.json');
const passport = require('passport');
const healthcheck = require('@hmcts/nodejs-healthcheck');
const multer = require('multer');
const logger = Logger.getLogger('routes');

export default function(app: Application): void {
  // TODO: use this to toggle between different auth identities
  const authType = (process.env.OIDC === 'true') ? 'azuread-openidconnect' : 'mockaroo';
  // const authType = 'mockaroo';
  logger.info('authType', authType);
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

  const FRONTEND_URL = process.env.FRONTEND_URL || 'https://pip-frontend.staging.platform.hmcts.net';
  logger.info('FRONTEND_URL', FRONTEND_URL);
  const corsOptions = {
    origin: 'https://pib2csbox.b2clogin.com',
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: '*',
    exposedHeaders: '*',
    optionsSuccessStatus: 200,
  };

  function ensureAuthenticated(req, res, next): NextFunction | void {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login?p=' + authenticationConfig.POLICY);
  }

  function globalAuthGiver(req, res, next): void{
    //this function allows us to share authentication status across all views
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
  }

  function logOut(_req, res): void{
    res.clearCookie('session');
    logger.info('logout FE URL', FRONTEND_URL);
    const B2C_URL = 'https://pib2csbox.b2clogin.com/pib2csbox.onmicrosoft.com/';
    const encodedSignOutRedirect = encodeURIComponent(`${FRONTEND_URL}/view-option`);
    logger.info('B2C_URL', B2C_URL);
    logger.info('encodedSignOutRedirect', encodedSignOutRedirect);
    res.redirect(`${B2C_URL}${authenticationConfig.POLICY}/oauth2/v2.0/logout?post_logout_redirect_uri=${encodedSignOutRedirect}`);
  }

  function regenerateSession(req, res): void {
    const prevSession = req.session;
    logger.info('regenerateSession', prevSession);
    req.session.regenerate(() => {  // Compliant
      logger.info('regenerateSession new session', req.session);
      Object.assign(req.session, prevSession);
      res.redirect('/subscription-management');
    });
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
  app.post('/create-media-account', app.locals.container.cradle.createMediaAccountController.post);
  app.get('/daily-cause-list', app.locals.container.cradle.dailyCauseListController.get);
  app.get('/family-daily-cause-list', app.locals.container.cradle.dailyCauseListController.get);
  app.get('/hearing-list', app.locals.container.cradle.hearingListController.get);
  app.get('/interstitial', app.locals.container.cradle.interstitialController.get);
  app.get('/login', passport.authenticate(authType, { failureRedirect: '/'}), regenerateSession);
  app.post('/login/return', passport.authenticate(authType, { failureRedirect: '/view-option'}),
    (_req, res) => {res.redirect('/account-home');});
  app.get('/logout', logOut);
  app.get('/live-case-alphabet-search', app.locals.container.cradle.liveCaseCourtSearchController.get);
  app.get('/live-case-status', app.locals.container.cradle.liveCaseStatusController.get);
  app.get('/not-found', app.locals.container.cradle.notFoundPageController.get);
  app.get('/otp-template', cors(corsOptions), app.locals.container.cradle.otpTemplateController.get);
  app.get('/search', app.locals.container.cradle.searchController.get);
  app.post('/search', app.locals.container.cradle.searchController.post);
  app.get('/sign-in', app.locals.container.cradle.signInController.get);
  app.post('/sign-in', app.locals.container.cradle.signInController.post);
  app.get('/view-option', app.locals.container.cradle.viewOptionController.get);
  app.post('/view-option', app.locals.container.cradle.viewOptionController.post);
  app.get('/summary-of-publications', app.locals.container.cradle.summaryOfPublicationsController.get);
  app.get('/file-publication', app.locals.container.cradle.flatFileController.get);
  app.get('/sjp-public-list', app.locals.container.cradle.sjpPublicListController.get);

  // Restricted paths
  app.get('/account-home', ensureAuthenticated, app.locals.container.cradle.accountHomeController.get);
  app.get('/admin-dashboard', ensureAuthenticated, app.locals.container.cradle.adminDashboardController.get);
  app.get('/case-name-search', ensureAuthenticated, app.locals.container.cradle.caseNameSearchController.get);
  app.post('/case-name-search', ensureAuthenticated, app.locals.container.cradle.caseNameSearchController.post);
  app.get('/case-name-search-results', ensureAuthenticated, app.locals.container.cradle.caseNameSearchResultsController.get);
  app.get('/case-reference-number-search', ensureAuthenticated, app.locals.container.cradle.caseReferenceNumberSearchController.get);
  app.post('/case-reference-number-search', ensureAuthenticated, app.locals.container.cradle.caseReferenceNumberSearchController.post);
  app.get('/case-reference-number-search-results', ensureAuthenticated, app.locals.container.cradle.caseReferenceNumberSearchResultController.get);
  app.get('/court-name-search', ensureAuthenticated, app.locals.container.cradle.alphabeticalSearchController.get);
  app.post('/court-name-search', ensureAuthenticated, app.locals.container.cradle.alphabeticalSearchController.post);
  app.get('/create-admin-account', ensureAuthenticated, app.locals.container.cradle.createAdminAccountController.get);
  app.post('/create-admin-account', ensureAuthenticated, app.locals.container.cradle.createAdminAccountController.post);
  app.get('/create-admin-account-summary', ensureAuthenticated, app.locals.container.cradle.createAdminAccountSummaryController.get);
  app.post('/create-admin-account-summary', ensureAuthenticated, app.locals.container.cradle.createAdminAccountSummaryController.post);
  app.get('/delete-subscription', ensureAuthenticated, app.locals.container.cradle.deleteSubscriptionController.get);
  app.get('/pending-subscriptions', ensureAuthenticated, app.locals.container.cradle.pendingSubscriptionsController.get);
  app.post('/pending-subscriptions', ensureAuthenticated, app.locals.container.cradle.pendingSubscriptionsController.post);
  app.get('/remove-list-confirmation', ensureAuthenticated, app.locals.container.cradle.removeListConfirmationController.get);
  app.post('/remove-list-confirmation', ensureAuthenticated, app.locals.container.cradle.removeListConfirmationController.post);
  app.get('/remove-list-search', ensureAuthenticated, app.locals.container.cradle.removeListSearchController.get);
  app.post('/remove-list-search', ensureAuthenticated, app.locals.container.cradle.removeListSearchController.post);
  app.get('/remove-list-search-results', ensureAuthenticated, app.locals.container.cradle.removeListSearchResultsController.get);
  app.get('/remove-list-success', ensureAuthenticated, app.locals.container.cradle.removeListSuccessController.get);
  app.get('/remove-subscription', ensureAuthenticated, app.locals.container.cradle.pendingSubscriptionsController.removeSubscription);
  app.get('/sjp-press-list', ensureAuthenticated, app.locals.container.cradle.sjpPressListController.get);
  app.get('/subscription-add', ensureAuthenticated, app.locals.container.cradle.subscriptionAddController.get);
  app.post('/subscription-add', ensureAuthenticated, app.locals.container.cradle.subscriptionAddController.post);
  app.post('/subscription-confirmed', ensureAuthenticated, app.locals.container.cradle.subscriptionConfirmedController.post);
  app.get('/subscription-management', ensureAuthenticated, app.locals.container.cradle.subscriptionManagementController.get);
  app.get('/subscription-urn-search', ensureAuthenticated, app.locals.container.cradle.subscriptionUrnSearchController.get);
  app.post('/subscription-urn-search', ensureAuthenticated, app.locals.container.cradle.subscriptionUrnSearchController.post);
  app.get('/subscription-urn-search-results', ensureAuthenticated, app.locals.container.cradle.subscriptionUrnSearchResultController.get);
  app.post('/unsubscribe-confirmation', ensureAuthenticated, app.locals.container.cradle.unsubscribeConfirmationController.post);

  // restricted admin paths
  app.get('/manual-upload', ensureAuthenticated, app.locals.container.cradle.manualUploadController.get);
  app.post('/manual-upload', ensureAuthenticated, multer({storage: storage, limits: {fileSize: 2000000}}).single('manual-file-upload'), fileSizeLimitErrorHandler, app.locals.container.cradle.manualUploadController.post);
  app.get('/manual-upload-summary', ensureAuthenticated, app.locals.container.cradle.manualUploadSummaryController.get);
  app.post('/manual-upload-summary', ensureAuthenticated, app.locals.container.cradle.manualUploadSummaryController.post);
  app.get('/upload-confirmation', ensureAuthenticated, app.locals.container.cradle.fileUploadConfirmationController.get);
  app.get('/media-account-review/image', ensureAuthenticated, app.locals.container.cradle.mediaAccountReviewController.getImage);
  app.get('/media-account-approval', ensureAuthenticated, app.locals.container.cradle.mediaAccountApprovalController.get);
  app.post('/media-account-approval', ensureAuthenticated, app.locals.container.cradle.mediaAccountApprovalController.post);

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

  // TODO: expose route only if not on the production environment
  app.get('/mock-session', app.locals.container.cradle.mockSessionController.get);
  /* istanbul ignore next */
  app.post('/mock-login', passport.authenticate(authType, { failureRedirect: '/not-found'}),
    (_req, res) => {res.redirect('/subscription-management');});

  //TODO: To be deleted/modified post UAT with suitable solution
  app.get('/warned-list', app.locals.container.cradle.warnedListController.get);
  app.get('/standard-list', ensureAuthenticated, app.locals.container.cradle.standardListController.get);

  const healthCheckConfig = {
    checks: {
      // TODO: replace this sample check with proper checks for your application
      sampleCheck: healthcheck.raw(() => healthcheck.up()),
    },
  };

  healthcheck.addTo(app, healthCheckConfig);
}
