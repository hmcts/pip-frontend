
const helpers = require('../Helpers/Selectors');

export class SubscriptionCaseSearchResultsPage {

  async getPageTitle(): Promise<string> {
    $(helpers.SearchCaseResultTitle).catch(() => {
      console.log(`${helpers.SearchCaseResultTitle} not found`);
    });

    return $(helpers.SearchCaseResultTitle).getText();
  }

  async getResults(): Promise<number> {
    $(helpers.Results).catch(() => {
      console.log(`${helpers.Results} not found`);
    });

    const results = $$(helpers.Results);
    return results.length;
  }

}
