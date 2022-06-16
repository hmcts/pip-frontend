export class CookiePolicy {
  essential: boolean;
  analytics: boolean;
  performance: boolean;

  constructor(analytics, performance) {
    this.essential = true;
    this.analytics = analytics;
    this.performance = performance;
  }
}
