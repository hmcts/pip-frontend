import {CommonPage} from './Common.page';
import {BulkDeleteSubscriptionsConfirmedPage} from './BulkDeleteSubscriptionsConfirmed.page';

const helpers = require('../Helpers/Selectors');

export class BulkDeleteSubscriptionsConfirmationPage extends CommonPage {
  async clickContinueForYes(): Promise<BulkDeleteSubscriptionsConfirmedPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    await $(helpers.ContinueButton).click();
    return new BulkDeleteSubscriptionsConfirmedPage();
  }
}
