import { CommonPage } from './Common.page';

const helpers = require('../Helpers/Selectors');

export class DailyCauseListPage extends CommonPage {
  async getPageTitle(): Promise<string> {
    $(helpers.DailyCauseListTitle).catch(() => {
      console.log(`${helpers.DailyCauseListTitle} not found`);
    });

    return $(helpers.DailyCauseListTitle).getText();
  }
}
