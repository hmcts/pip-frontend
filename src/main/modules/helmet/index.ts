import * as express from 'express';
import * as helmet from 'helmet';
import { B2C_ADMIN_URL, B2C_URL, CFT_IDAM_URL } from '../../helpers/envUrls';
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
    constructor(public config: HelmetConfig) {}

    public enableFor(app: express.Express): void {
        // include default helmet functions
        app.use(helmet.default());

        this.setContentSecurityPolicy(app);
        this.setReferrerPolicy(app, this.config.referrerPolicy);
    }

    private setContentSecurityPolicy(app: express.Express): void {
        app.use((req, res, next) => {
            res.locals.cspNonce = randomBytes(32).toString("hex");
            next();
        });

        app.use(
            helmet.contentSecurityPolicy({
                directives: {
                    connectSrc: [self, ...googleAnalyticsDomains, dynatraceDomain],
                    defaultSrc: ["'none'"],
                    fontSrc: [self, 'data:'],
                    imgSrc: [self, ...googleAnalyticsDomains, dynatraceDomain],
                    objectSrc: [self],
                    scriptSrcAttr: [self],
                    manifestSrc: [self, process.env.FRONTEND_URL],
                    scriptSrc: [self, ...googleAnalyticsDomains, dynatraceDomain,
                        "'unsafe-eval'",
                        (req, res) => `'nonce-${res['locals'].cspNonce}'`],
                    styleSrc: [self, process.env.FRONTEND_URL],
                    formAction: [self, B2C_URL, B2C_ADMIN_URL, CFT_IDAM_URL],
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
