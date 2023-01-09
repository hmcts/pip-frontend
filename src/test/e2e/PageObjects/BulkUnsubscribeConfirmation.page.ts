import {CommonPage} from './Common.page';
import {BulkUnsubscribeConfirmedPage} from './BulkUnsubscribeConfirmed.page';

const helpers = require('../Helpers/Selectors');

export class BulkUnsubscribeConfirmationPage extends CommonPage {
  async clickContinueForYes(): Promise<BulkUnsubscribeConfirmedPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    await $(helpers.ContinueButton).click();
    return new BulkUnsubscribeConfirmedPage();
  }
}
