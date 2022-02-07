import { Application, NextFunction } from 'express';
import { infoRequestHandler } from '@hmcts/info-provider';
import cors  from 'cors';
import os from 'os';
import process from 'process';

const authenticationConfig = require('../authentication/authentication-config.json');
const passport = require('passport');
const healthcheck = require('@hmcts/nodejs-healthcheck');

export default function(app: Application): void {
  // TODO: use this to toggle between different auth identities
  const authType = (process.env.OIDC === 'true') ? 'azuread-openidconnect' : 'mockaroo';
  // const authType = 'azuread-openidconnect';
  const FRONTEND_URL = process.env.FRONTEND_URL || 'https://pip-frontend.staging.platform.hmcts.net';
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

  function logOut(req, res): void{
    res.clearCookie('session');
    const B2C_URL = 'https://pib2csbox.b2clogin.com/pib2csbox.onmicrosoft.com/';
    const encodedSignOutRedirect = encodeURIComponent(`${FRONTEND_URL}/view-option`);
    res.redirect(`${B2C_URL}${authenticationConfig.POLICY}/oauth2/v2.0/logout?post_logout_redirect_uri=${encodedSignOutRedirect}`);
  }

  function regenerateSession(req, res): void {
    const prevSession = req.session;
    req.session.regenerate(() => {  // Compliant
      Object.assign(req.session, prevSession);
      res.redirect('/subscription-management');
    });
  }

  // Public paths
  app.get('/*', globalAuthGiver);
  app.post('/*', globalAuthGiver);
  app.get('/', app.locals.container.cradle.homeController.get);
  app.get('/alphabetical-search', app.locals.container.cradle.alphabeticalSearchController.get);
  app.post('/alphabetical-search', app.locals.container.cradle.alphabeticalSearchController.post);
  app.get('/case-event-glossary', app.locals.container.cradle.caseEventGlossaryController.get);
  app.get('/hearing-list', app.locals.container.cradle.hearingListController.get);
  app.get('/login', passport.authenticate(authType, { failureRedirect: '/'}), regenerateSession);
  app.post('/login/return', passport.authenticate(authType, { failureRedirect: '/view-option'}),
    (req, res) => {res.redirect('/account-home');});
  app.get('/logout', logOut);
  app.get('/live-case-alphabet-search', app.locals.container.cradle.liveCaseCourtSearchController.get);
  app.get('/live-case-status', app.locals.container.cradle.liveCaseStatusController.get);
  app.get('/not-found', app.locals.container.cradle.notFoundPageController.get);
  app.get('/otp-template', cors(corsOptions), app.locals.container.cradle.otpTemplateController.get);
  app.get('/search', app.locals.container.cradle.searchController.get);
  app.post('/search', app.locals.container.cradle.searchController.post);
  app.get('/sign-in', app.locals.container.cradle.signInController.get);
  app.post('/sign-in', app.locals.container.cradle.signInController.post);
  app.get('/single-justice-procedure', app.locals.container.cradle.singleJusticeProcedureController.get);
  app.get('/view-option', app.locals.container.cradle.viewOptionController.get);
  app.post('/view-option', app.locals.container.cradle.viewOptionController.post);

  // Restricted paths
  app.get('/account-home', ensureAuthenticated, app.locals.container.cradle.accountHomeController.get);
  app.get('/case-name-search', ensureAuthenticated, app.locals.container.cradle.caseNameSearchController.get);
  app.post('/case-name-search', ensureAuthenticated, app.locals.container.cradle.caseNameSearchController.post);
  app.get('/case-name-search-results', ensureAuthenticated, app.locals.container.cradle.caseNameSearchResultsController.get);
  app.get('/case-reference-number-search', ensureAuthenticated, app.locals.container.cradle.caseReferenceNumberSearchController.get);
  app.post('/case-reference-number-search', ensureAuthenticated, app.locals.container.cradle.caseReferenceNumberSearchController.post);
  app.get('/case-reference-number-search-results', ensureAuthenticated, app.locals.container.cradle.caseReferenceNumberSearchResultController.get);
  app.get('/court-name-search', ensureAuthenticated, app.locals.container.cradle.courtNameSearchController.get);
  app.post('/court-name-search', ensureAuthenticated, app.locals.container.cradle.courtNameSearchController.post);
  app.get('/delete-subscription', ensureAuthenticated, app.locals.container.cradle.deleteSubscriptionController.get);
  app.get('/pending-subscriptions', ensureAuthenticated, app.locals.container.cradle.pendingSubscriptionsController.get);
  app.post('/pending-subscriptions', ensureAuthenticated, app.locals.container.cradle.pendingSubscriptionsController.post);
  app.get('/remove-subscription', ensureAuthenticated, app.locals.container.cradle.pendingSubscriptionsController.removeSubscription);
  app.get('/subscription-add', ensureAuthenticated, app.locals.container.cradle.subscriptionAddController.get);
  app.post('/subscription-add', ensureAuthenticated, app.locals.container.cradle.subscriptionAddController.post);
  app.post('/subscription-confirmed', ensureAuthenticated, app.locals.container.cradle.subscriptionConfirmedController.post);
  app.get('/subscription-management', ensureAuthenticated, app.locals.container.cradle.subscriptionManagementController.get);
  app.get('/subscription-urn-search', ensureAuthenticated, app.locals.container.cradle.subscriptionUrnSearchController.get);
  app.post('/subscription-urn-search', ensureAuthenticated, app.locals.container.cradle.subscriptionUrnSearchController.post);
  app.get('/subscription-urn-search-results', ensureAuthenticated, app.locals.container.cradle.subscriptionUrnSearchResultController.get);
  app.post('/unsubscribe-confirmation', ensureAuthenticated, app.locals.container.cradle.unsubscribeConfirmationController.post);

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

  app.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send('User-agent: *\nDisallow: /');
  });

  // TODO: expose route only if not on the production environment
  app.get('/mock-session', app.locals.container.cradle.mockSessionController.get);
  /* istanbul ignore next */
  app.post('/mock-login', passport.authenticate(authType, { failureRedirect: '/not-found'}),
    (req, res) => {res.redirect('/subscription-management');});

  //TODO: To be deleted/modified post UAT with suitable solution
  app.get('/list-option', app.locals.container.cradle.listOptionController.get);
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
