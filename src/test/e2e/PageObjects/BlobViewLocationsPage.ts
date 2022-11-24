import { CommonPage } from './Common.page';
import { BlobViewPublicationsPage } from './BlobViewPublicationsPage';

const helpers = require('../Helpers/Selectors');

export class BlobViewLocationsPage extends CommonPage {

  async selectFirstListResult(): Promise<BlobViewPublicationsPage> {
    await $(helpers.locationSelector).catch(() => {
      console.log(`${helpers.locationSelector} not found`);
    });

    await $(helpers.locationSelector).click();
    return new BlobViewPublicationsPage();
  }

}
