import * as process from 'process';
import { I18next } from './modules/i18next';
import { RedisStore } from 'connect-redis';
import cookieParser from 'cookie-parser';
import config from 'config';
import { Logger } from '@hmcts/nodejs-logging';
import * as bodyParser from 'body-parser';
import session from 'express-session';
import express, { NextFunction } from 'express';
import { Helmet } from './modules/helmet';
import * as path from 'path';
import { HTTPError } from 'HttpError';
import { Nunjucks } from './modules/nunjucks';
import passport from 'passport';
import { setupDev } from './development';

import { Container } from './modules/awilix';
import { PipRequest } from './models/request/PipRequest';
import { redisClient } from './cacheManager';

const env = process.env.NODE_ENV || 'development';
const developmentMode = env === 'development';
export const app: express.Express = express();

export async function appSetup() {
    app.enable('trust proxy');
    app.locals.ENV = env;
    app.locals.POLICY = process.env.POLICY;

    const logger = Logger.getLogger('app');

    const routes = await import('./routes/routes');

    new Nunjucks(developmentMode).enableFor(app);
    new Helmet(config.get('security'), developmentMode).enableFor(app);
    new Container().enableFor(app);

    logger.info('environment', env);

    app.get('/favicon.ico', (req, res) => {
        res.sendFile(path.join(__dirname, '/public/assets/rebrand/images/favicon.ico'));
    });

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, 'public')));

    const redisStore = new RedisStore({
        client: redisClient,
    });

    let sessionSecret;
    if (process.env.SESSION_SECRET) {
        sessionSecret = process.env.SESSION_SECRET;
    } else {
        sessionSecret = config.get('secrets.pip-ss-kv.SESSION_SECRET');
    }

    app.set('trust proxy', 1);
    app.use(
        session({
            store: redisStore,
            secret: sessionSecret,
            resave: false,
            saveUninitialized: false,
            cookie: { secure: true, sameSite: process.env.SESSION_COOKIE_SAME_SITE },
        })
    );

    app.use(passport.initialize());
    app.use(passport.session());

    app.use((req, res, next) => {
        res.setHeader('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');
        next();
    });

    app.use(cookieParser(sessionSecret));
    new I18next().enableFor(app);

    //main routes
    routes.default(app);

    setupDev(app, developmentMode);

    // returning "not found" page for requests with paths not resolved by the router
    app.use((req: PipRequest, res) => {
        res.status(404);
        res.render('not-found', req.i18n.getDataByLanguage(req.lng)['not-found']);
    });

    // error handler - pass in the next function so any unhandled errors are caught here
    /* eslint-disable @typescript-eslint/no-unused-vars */
    app.use((err: HTTPError, req: PipRequest, res: express.Response, next: NextFunction) => {
        logger.error(`${err.stack || err}`);

        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = env === 'development' ? err : {};
        res.status(err.status || 500);
        res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    });

    const oidc = await import('./authentication/authentication');
    await oidc.oidcSetup();
}
