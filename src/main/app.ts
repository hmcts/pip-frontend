import * as process from 'process';
import {I18next} from './modules/i18next';

const {Logger} = require('@hmcts/nodejs-logging');

import * as bodyParser from 'body-parser';
import config = require('config');
import cookieParser from 'cookie-parser';
import express from 'express';
import {Helmet} from './modules/helmet';
import * as path from 'path';
import favicon from 'serve-favicon';
import {HTTPError} from 'HttpError';
import {Nunjucks} from './modules/nunjucks';
import {PropertiesVolume} from './modules/properties-volume';
import {AppInsights} from './modules/appinsights';
import session from 'express-session';
import authentication from './authentication/authentication';

const passport = require('passport');

const {setupDev} = require('./development');
import {Container} from './modules/awilix';
import routes from './routes/routes';
import {PipRequest} from './models/request/PipRequest';
import * as fs from 'fs';


function populateSecrets(): void {
  if (process.env.SECRETS_DIRECTORY) {
    const secretsdirectory = process.env.SECRETS_DIRECTORY;

    const files = fs.readdirSync(secretsdirectory);

    for( const fileName of files ) {
      console.info(fileName);
      try {
        const data = fs.readFileSync(secretsdirectory + '/' + fileName, 'binary');
        process.env[fileName] = data.trim();
      } catch (err) {
        console.error('Error reading file: ' + fileName);
      }
    }
  }
}

populateSecrets();

const env = process.env.NODE_ENV || 'development';
const developmentMode = env === 'development';

export const app = express();
app.locals.ENV = env;

app.locals.POLICY = process.env.POLICY;

const logger = Logger.getLogger('app');

new PropertiesVolume().enableFor(app);

new AppInsights().enable();
new Nunjucks(developmentMode).enableFor(app);
new Helmet(config.get('security')).enableFor(app);
new Container().enableFor(app);

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true },
};

app.use(favicon(path.join(__dirname, '/public/assets/images/favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.setHeader(
    'Cache-Control',
    'no-cache, max-age=0, must-revalidate, no-store',
  );
  next();
});
new I18next().enableFor(app);

//main routes
routes(app);

setupDev(app, developmentMode);
// returning "not found" page for requests with paths not resolved by the router
app.use((req: PipRequest, res) => {
  res.status(404);
  res.render('not-found', req.i18n.getDataByLanguage(req.lng)['not-found']);
});

// error handler
app.use((err: HTTPError, req: PipRequest, res: express.Response) => {
  logger.error(`${err.stack || err}`);

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = env === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error', req.i18n.getDataByLanguage(req.lng).error);
});

authentication(process.env.OIDC);
