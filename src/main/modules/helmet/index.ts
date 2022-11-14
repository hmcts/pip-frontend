import * as express from 'express';
import helmet = require('helmet');

export interface HelmetConfig {
  referrerPolicy: string;
}

const self = "'self'";
const googleAnalyticsDomain = '*.google-analytics.com';
const tagManager = ['*.googletagmanager.com', 'https://tagmanager.google.com'];

/**
 * Module that enables helmet in the application
 */
export class Helmet {
  constructor(public config: HelmetConfig) {}

  public enableFor(app: express.Express): void {
    // include default helmet functions
    app.use(helmet());

    this.setContentSecurityPolicy(app);
    this.setReferrerPolicy(app, this.config.referrerPolicy);
  }

  private setContentSecurityPolicy(app: express.Express): void {
    app.use(
      helmet.contentSecurityPolicy({
        directives: {
          connectSrc: [self, googleAnalyticsDomain],
          defaultSrc: ["'none'"],
          fontSrc: [self, 'data:'],
          imgSrc: [self],
          objectSrc: [self],
          scriptSrc: [self, ...tagManager, googleAnalyticsDomain, "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: [self, 'https://pip-frontend.staging.platform.hmcts.net'],
        },
      })
    );
  }

  private setReferrerPolicy(app: express.Express, policy: string): void {
    if (!policy) {
      throw new Error('Referrer policy configuration is required');
    }

    app.use(helmet.referrerPolicy({ policy }));
  }
}
