import { CommonPage } from './Common.page';

const helpers = require('../Helpers/Selectors');

export class BlobViewPublicationsPage extends CommonPage {

  async getPageTitle(): Promise<string> {
    $(helpers.CommonPageTitleXl).catch(() => {
      console.log(`${helpers.CommonPageTitleXl} not found`);
    });

    return $(helpers.CommonPageTitleXl).getText();
  }

  async getFirstPub(): Promise<string> {
    $(helpers.FirstItemResult).catch(() => {
      console.log(`${helpers.FirstItemResult} not found`);
    });
    return $(helpers.FirstItemResult).getAttribute('href');
  }
}
