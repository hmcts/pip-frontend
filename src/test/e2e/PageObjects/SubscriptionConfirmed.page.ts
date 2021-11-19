
const helpers = require('../Helpers/Selectors');

export class SubscriptionConfirmedPage {

  async getPageTitle(): Promise<string> {
    $(helpers.SearchResultTitle).catch(() => {
      console.log(`${helpers.SearchResultTitle} not found`);
    });

    return $(helpers.SearchResultTitle).getText();
  }


}
