import i18next from 'i18next';
const i18nextMiddleware = require('i18next-http-middleware');
import express = require('express');
import { NextFunction, Response } from 'express';
import { PipRequest } from '../../models/request/PipRequest';

const requireDir = require('require-directory');
const resources = requireDir(module, '../../resources', {
    include: /locales/,
}).locales;

export class I18next {
    constructor() {
        const options = {
            preload: ['en', 'cy'],
            resources,
            fallbackLng: 'en',
            supportedLngs: ['en', 'cy'],
            detection: {
                order: ['querystring', 'session', 'cookie'],
                caches: ['session', 'cookie'],
            },
        };

        i18next.use(i18nextMiddleware.LanguageDetector).init(options);
    }

    public enableFor(app: express.Express): void {
        app.use(i18nextMiddleware.handle(i18next));
        app.use((req: PipRequest, res: Response, next: NextFunction) => {
            Object.assign(res.locals, req, req.i18n.getDataByLanguage(req.lng).template);
            next();
        });
    }
}
