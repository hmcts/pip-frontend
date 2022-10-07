import {CommonPage} from './Common.page';

const helpers = require('../Helpers/Selectors');

export class SessionLoggedOutPage extends CommonPage {
  async getPageTitle(): Promise<string> {
    $(helpers.SessionLoggedOutTitle).catch(() => {
      console.log(`${helpers.SessionLoggedOutTitle} not found`);
    });

    return $(helpers.SessionLoggedOutTitle).getText();
  }
}
