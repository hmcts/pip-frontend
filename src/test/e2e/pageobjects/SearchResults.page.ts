import { HearingListPage } from './HearingList.page';
import {PageBase} from './Base/PageBase.page';

const helpers = require('../Helpers/Selectors');

export class SearchResultsPage extends PageBase {

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
