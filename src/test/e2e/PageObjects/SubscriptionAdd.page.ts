const helpers = require('../Helpers/Selectors');

export class SubscriptionAddPage {

  open(path): Promise<string> {
    return browser.url(path);
  }

  async getPageTitle(): Promise<string> {
    $(helpers.SubscriptionAddTitle).catch(() => {
      console.log(`${helpers.SubscriptionAddTitle} not found`);
    });

    return $(helpers.SubscriptionAddTitle).getText();
  }
}
