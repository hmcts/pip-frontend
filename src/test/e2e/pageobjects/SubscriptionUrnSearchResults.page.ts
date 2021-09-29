import { HearingListPage } from './HearingList.page';

const helpers = require('../Helpers/Selectors');

export class SubscriptionUrnSearchResultsPage {

  async getPageTitle(): Promise<string> {
    $(helpers.SearchResultTitle).catch(() => {
      console.log(`${helpers.SearchResultTitle} not found`);
    });

    return $(helpers.SearchResultTitle).getText();
  }

  async getResults(): Promise<number> {
    $(helpers.Results).catch(() => {
      console.log(`${helpers.Results} not found`);
    });

    const results = $$(helpers.Results);
    return results.length;
  }

  async selectCourt(): Promise<HearingListPage> {
    $(helpers.LinkResult).catch(() => {
      console.log(`${helpers.LinkResult} not found`);
    });
    const linkResult = await $(helpers.LinkResult);
    linkResult.click();

    return new HearingListPage();
  }
}
