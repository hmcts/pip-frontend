import { CommonPage } from './Common.page';

const helpers = require('../Helpers/Selectors');

export class DailyCauseListPage extends CommonPage {
  async getPageTitle(): Promise<string> {
    $(helpers.comm).catch(() => {
      console.log(`${helpers.CommonPageTitle} not found`);
    });

    return $(helpers.CommonPageTitle).getText();
  }
}
