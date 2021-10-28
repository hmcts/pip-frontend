import {Application, NextFunction} from 'express';
import {infoRequestHandler} from '@hmcts/info-provider';
import cors  from 'cors';
import os from 'os';

const authenticationConfig = require('../authentication/authentication-config.json');

const passport = require('passport');
const healthcheck = require('@hmcts/nodejs-healthcheck');

export default function(app: Application): void {

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

  app.post('/login/return', passport.authenticate('azuread-openidconnect', { failureRedirect: '/error'}),
    regenerateSession);

  app.get('/login', passport.authenticate('azuread-openidconnect', { failureRedirect: '/error'}),
    regenerateSession);

  app.get('/subscription-add', app.locals.container.cradle.subscriptionAddController.get);
  app.post('/subscription-add', app.locals.container.cradle.subscriptionAddController.post);

  app.get('/view-option', app.locals.container.cradle.viewOptionController.get);
  app.post('/view-option', app.locals.container.cradle.viewOptionController.post);

  app.get('/live-case-alphabet-search',  app.locals.container.cradle.liveCaseCourtSearchController.get);

  app.get('/live-case-status', app.locals.container.cradle.liveCaseStatusController.get);

  app.get('/single-justice-procedure-search', app.locals.container.cradle.singleJusticeProcedureSearchController.get);

  const healthCheckConfig = {
    checks: {
      // TODO: replace this sample check with proper checks for your application
      sampleCheck: healthcheck.raw(() => healthcheck.up()),
    },
  };

  healthcheck.addTo(app, healthCheckConfig);
}
