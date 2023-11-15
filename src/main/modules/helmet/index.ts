import * as express from 'express';
import * as helmet from 'helmet';

export interface HelmetConfig {
    referrerPolicy: string;
}

const self = "'self'";
const googleAnalyticsDomains = ['*.googletagmanager.com', 'https://tagmanager.google.com', '*.google-analytics.com'];
const dynatraceDomain = 'https://*.dynatrace.com';
const jsdelivrDomain = '*.jsdelivr.net';

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
        app.use(
            helmet.contentSecurityPolicy({
                directives: {
                    connectSrc: [self, ...googleAnalyticsDomains, dynatraceDomain],
                    defaultSrc: ["'none'"],
                    fontSrc: [self, 'data:'],
                    imgSrc: [self, ...googleAnalyticsDomains, dynatraceDomain],
                    objectSrc: [self],
                    scriptSrc: [
                        self,
                        ...googleAnalyticsDomains,
                        dynatraceDomain,
                        jsdelivrDomain,
                        "'unsafe-eval'",
                        "'unsafe-inline'",
                    ],
                    styleSrc: [self, process.env.FRONTEND_URL],
                },
            })
        );
    }

    private setReferrerPolicy(app: express.Express, policy: string): void {
        if (!policy) {
            throw new Error('Referrer policy configuration is required');
        }

        app.use(helmet.referrerPolicy({ 'policy': policy }));
    }
}
