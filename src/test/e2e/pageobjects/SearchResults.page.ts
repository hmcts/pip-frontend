import { HearingListPage } from './HearingList.page';

const helpers = require('../Helpers/Selectors');

export class SearchResultsPage {

  async pageTitle(): Promise<string> {
    $(helpers.CommonPageTitle).catch(() => {
      console.log(`${helpers.CommonPageTitle} not found`);
    });

    return $(helpers.CommonPageTitle).getText();
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
