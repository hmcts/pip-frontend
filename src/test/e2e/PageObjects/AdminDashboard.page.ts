import { CommonPage } from './Common.page';
import { ManualUploadPage } from './ManualUpload.page';

const helpers = require('../Helpers/Selectors');

export class AdminDashboardPage extends CommonPage {
  async clickUploadFileCard(): Promise<ManualUploadPage> {
    await $(helpers.UploadFile).catch(() => {
      console.log(`${helpers.EmailSubscriptionLink} not found`);
    });

    await $(helpers.EmailSubscriptionLink).click();
    return new ManualUploadPage();
  }
}
