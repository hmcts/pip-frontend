import { CommonPage } from './Common.page';
import { BlobViewPublicationsPage } from './BlobViewPublicationsPage';

const helpers = require('../Helpers/Selectors');

export class BlobViewJsonPage extends CommonPage {

  async getPageTitle(): Promise<string> {
    $(helpers.CommonPageTitle).catch(() => {
      console.log(`${helpers.CommonPageTitle} not found`);
    });

    return $(helpers.CommonPageTitle).getText();
  }
}
