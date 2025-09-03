import i18next, { Resource } from 'i18next';
import i18nextMiddleware from 'i18next-http-middleware';
import express from 'express';
import { NextFunction, Response } from 'express';
import { PipRequest } from '../../models/request/PipRequest';
import requireDir from 'require-directory';

const resources = requireDir(module, '../../resources', {
    include: /locales/,
}).locales as Resource;

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
            res.locals.htmlLang = req.lng; //This is used by the Gov UK Template to set the HTML Lang attribute
            next();
        });
    }
}
