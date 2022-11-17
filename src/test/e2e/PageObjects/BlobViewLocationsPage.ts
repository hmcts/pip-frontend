import { CommonPage } from './Common.page';

const helpers = require('../Helpers/Selectors');

export class BlobViewLocationsPage extends CommonPage {

  async getPageTitle(): Promise<string> {
    $(helpers.CommonPageTitleXl).catch(() => {
      console.log(`${helpers.CommonPageTitleXl} not found`);
    });

    return $(helpers.CommonPageTitleXl).getText();
  }
}
