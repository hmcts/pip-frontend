#!/usr/bin/env node
import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';

//It's important App Insights is imported here and enabled before startup to ensure that logs are correctly sent to App Insights.
import { AppInsights } from './modules/appinsights';
import * as propertiesVolume from '@hmcts/properties-volume';
import config from 'config';
propertiesVolume.addTo(config);
new AppInsights().enable();

import { appSetup, app } from './app';

import { Logger } from '@hmcts/nodejs-logging';
const logger = Logger.getLogger('server');

const port: number = parseInt(process.env.PORT, 10) || 8080;

appSetup().then(() => {
    if (app.locals.ENV === 'development') {
        const sslDirectory = path.join(__dirname, 'resources', 'localhost-ssl');
        const sslOptions = {
            secureProtocol: 'TLSv1_2_method',
            cert: fs.readFileSync(path.join(sslDirectory, 'localhost.crt')),
            key: fs.readFileSync(path.join(sslDirectory, 'localhost.key')),
        };
        const server = https.createServer(sslOptions, app);

        server.listen(port, () => {
            logger.info(`Application started: https://localhost:${port}`);
        });
    } else {
        app.listen(port, () => {
            logger.info(`Application started: http://localhost:${port}`);
        });
    }
});
