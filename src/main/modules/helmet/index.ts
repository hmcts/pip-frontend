import * as express from 'express';
import * as helmet from 'helmet';
import { B2C_ADMIN_URL, B2C_URL, CFT_IDAM_URL, CRIME_IDAM_URL } from '../../helpers/envUrls';
import { randomBytes } from 'crypto';

export interface HelmetConfig {
    referrerPolicy: string;
}

const self = "'self'";
const googleAnalyticsDomains = ['*.googletagmanager.com', 'https://tagmanager.google.com', '*.google-analytics.com'];
const dynatraceDomain = 'https://*.dynatrace.com';

/**
 * Module that enables helmet in the application
 */
export class Helmet {
    private readonly developmentMode: boolean;
    constructor(
        public config: HelmetConfig,
        developmentMode
    ) {
        this.developmentMode = developmentMode;
    }

    public enableFor(app: express.Express): void {
        // include default helmet functions
        app.use(helmet.default());

        this.setContentSecurityPolicy(app);
        this.setReferrerPolicy(app, this.config.referrerPolicy);
    }

    private setContentSecurityPolicy(app: express.Express): void {
        app.use((req, res, next) => {
            res.locals.cspNonce = randomBytes(32).toString('hex');
            next();
        });

        const scriptSrc = [
            self,
            ...googleAnalyticsDomains,
            dynatraceDomain,
            (req, res) => `'nonce-${res['locals'].cspNonce}'`,
        ];

        if (this.developmentMode) {
            scriptSrc.push("'unsafe-eval'");
        }

        app.use(
            helmet.contentSecurityPolicy({
                directives: {
                    defaultSrc: [self],
                    connectSrc: [self, ...googleAnalyticsDomains, dynatraceDomain],
                    imgSrc: [self, ...googleAnalyticsDomains],
                    scriptSrc,
                    frameAncestors: ["'none'"],
                    formAction: [self, B2C_URL, B2C_ADMIN_URL, CFT_IDAM_URL, CRIME_IDAM_URL],
                },
            })
        );
    }

    private setReferrerPolicy(app: express.Express, policy): void {
        if (!policy) {
            throw new Error('Referrer policy configuration is required');
        }

        app.use(helmet.referrerPolicy({ policy: policy }));
    }
}
