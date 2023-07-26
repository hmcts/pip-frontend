import * as process from 'process';
import { I18next } from './modules/i18next';

import { AppInsights } from './modules/appinsights';

import * as propertiesVolume from '@hmcts/properties-volume';
import config = require('config');
propertiesVolume.addTo(config);

const { Logger } = require('@hmcts/nodejs-logging');
import * as bodyParser from 'body-parser';

import cookieParser from 'cookie-parser';
import express from 'express';
import { Helmet } from './modules/helmet';
import * as path from 'path';
import favicon from 'serve-favicon';
import { HTTPError } from 'HttpError';
import { Nunjucks } from './modules/nunjucks';

const passport = require('passport');
const cookieSession = require('cookie-session');
const { setupDev } = require('./development');
import { Container } from './modules/awilix';
import { PipRequest } from './models/request/PipRequest';

const env = process.env.NODE_ENV || 'development';
const developmentMode = env === 'development';

export const app = express();
app.enable('trust proxy');
app.locals.ENV = env;
app.locals.POLICY = process.env.POLICY;

const logger = Logger.getLogger('app');

import routes from './routes/routes';

new AppInsights().enable();
new Nunjucks(developmentMode).enableFor(app);
new Helmet(config.get('security')).enableFor(app);
new Container().enableFor(app);

logger.info('environment', env);

app.use(favicon(path.join(__dirname, '/public/assets/images/favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    cookieSession({
        name: 'session',
        keys: [config.get('secrets.pip-ss-kv.SESSION_SECRET')],
        secure: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    req['sessionCookies'].secure = true;
    res.setHeader('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');
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

import authentication from './authentication/authentication';
authentication();
