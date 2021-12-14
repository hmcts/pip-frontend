import { CommonPage } from '../PageObjects/Common.page';

const helpers = require('../Helpers/Selectors');

export class HearingListPage extends CommonPage{
  async getResults(): Promise<number> {
    $(helpers.Results).catch(() => {
      console.log(`${helpers.Results} not found`);
    });
    const results = $$(helpers.Results);
    return results.length;
  }
}
