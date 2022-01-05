import { ViewOptionPage } from './ViewOption.page';
import { CommonPage } from './Common.page';

const helpers = require('../Helpers/Selectors');

export class HomePage extends CommonPage {
  async getPageTitle(): Promise<string> {
    $(helpers.MainHeader).catch(() => {
      console.log(`${helpers.MainHeader} not found`);
    });

    return $(helpers.MainHeader).getText();
  }

  async clickLinkToService(): Promise<ViewOptionPage> {
    const button = await $(helpers.ServiceLink);
    button.click();
    return new ViewOptionPage();
  }
}
