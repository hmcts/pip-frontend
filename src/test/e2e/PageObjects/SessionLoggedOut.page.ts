import {CommonPage} from './Common.page';

const helpers = require('../Helpers/Selectors');

export class SessionLoggedOutPage extends CommonPage {
  async getPageTitle(): Promise<string> {
    $(helpers.CommonPageTitle).catch(() => {
      console.log(`${helpers.CommonPageTitle} not found`);
    });

    return $(helpers.CommonPageTitle).getText();
  }
}
