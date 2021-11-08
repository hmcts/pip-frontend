import { Application, NextFunction } from 'express';
import {infoRequestHandler} from '@hmcts/info-provider';
import cors  from 'cors';
import os from 'os';

const authenticationConfig = require('../authentication/authentication-config.json');

const passport = require('passport');
const healthcheck = require('@hmcts/nodejs-healthcheck');

export default function(app: Application): void {
  // TODO: use this to toggle between different auth identities
  // const authType = (process.env.NODE_ENV === 'production') ? 'azuread-openidconnect' : 'mockaroo';
  const authType = 'mockaroo';

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

  function regenerateSession(req, res): void {
    const prevSession = req.session;
    req.session.regenerate(() => {  // Compliant
      Object.assign(req.session, prevSession);
      res.redirect('/subscription-management');
    });
  }

  app.get('/', app.locals.container.cradle.homeController.get);
  app.get('/search-option', app.locals.container.cradle.searchOptionController.get);
  app.get('/alphabetical-search', app.locals.container.cradle.alphabeticalSearchController.get);
  app.post('/alphabetical-search', app.locals.container.cradle.alphabeticalSearchController.post);
  app.get('/hearing-list', app.locals.container.cradle.hearingListController.get);
  app.get('/not-found', app.locals.container.cradle.notFoundPageController.get);
  app.get('/otp-template', cors(corsOptions), app.locals.container.cradle.otpTemplateController.get);
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
  app.get('/search', app.locals.container.cradle.searchController.get);
  app.post('/search-option', app.locals.container.cradle.searchOptionController.post);
  app.post('/search', app.locals.container.cradle.searchController.post);
  app.get('/subscription-management', ensureAuthenticated,
    app.locals.container.cradle.subscriptionManagementController.get);
  app.post('/login/return',passport.authenticate(authType, { failureRedirect: '/'}),
    regenerateSession);
  app.get('/login', passport.authenticate(authType, { failureRedirect: '/'}),
    regenerateSession);
  app.get('/subscription-add', ensureAuthenticated, app.locals.container.cradle.subscriptionAddController.get);
  app.post('/subscription-add', ensureAuthenticated, app.locals.container.cradle.subscriptionAddController.post);
  app.get('/status-description', app.locals.container.cradle.statusDescriptionController.get);
  app.get('/view-option', app.locals.container.cradle.viewOptionController.get);
  app.post('/view-option', app.locals.container.cradle.viewOptionController.post);
  app.get('/live-case-alphabet-search', app.locals.container.cradle.liveCaseCourtSearchController.get);
  app.get('/live-case-status', app.locals.container.cradle.liveCaseStatusController.get);
  app.get('/single-justice-procedure-search', app.locals.container.cradle.singleJusticeProcedureSearchController.get);
  app.get('/court-name-search', ensureAuthenticated, app.locals.container.cradle.courtNameSearchController.get);
  app.post('/court-name-search', ensureAuthenticated, app.locals.container.cradle.courtNameSearchController.post);
  app.get('/case-name-search', ensureAuthenticated, app.locals.container.cradle.caseNameSearchController.get);
  app.post('/case-name-search', ensureAuthenticated, app.locals.container.cradle.caseNameSearchController.post);
  app.get('/case-name-search-results', ensureAuthenticated, app.locals.container.cradle.caseNameSearchResultsController.get);

  // TODO: expose route only if not on the production environment
  app.get('/mock-session', app.locals.container.cradle.mockSessionController.get);
  app.post('/mock-login', passport.authenticate(authType, { failureRedirect: '/not-found'}),
    (req, res) => {res.redirect('/subscription-management');});

  const healthCheckConfig = {
    checks: {
      // TODO: replace this sample check with proper checks for your application
      sampleCheck: healthcheck.raw(() => healthcheck.up()),
    },
  };

  healthcheck.addTo(app, healthCheckConfig);
}
