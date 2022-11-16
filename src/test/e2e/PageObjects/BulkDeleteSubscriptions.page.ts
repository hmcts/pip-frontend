import { CommonPage } from './Common.page';
import {BulkDeleteSubscriptionsConfirmationPage} from './BulkDeleteSubscriptionsConfirmation.page';

const helpers = require('../Helpers/Selectors');

export class BulkDeleteSubscriptionsPage extends CommonPage {
  async clickBulkDeleteSubscriptionsButton(): Promise<BulkDeleteSubscriptionsConfirmationPage> {
    $(helpers.BulkDeleteSubscriptionButton).catch(() => {
      console.log(`${helpers.BulkDeleteSubscriptionButton} not found`);
    });
    await $(helpers.BulkDeleteSubscriptionButton).scrollIntoView();
    await $(helpers.BulkDeleteSubscriptionButton).click();
    return new BulkDeleteSubscriptionsConfirmationPage();
  }

  async courtSubscriptionChecked(): Promise<boolean> {
    await $(helpers.CourtSubscriptionCheckbox1).catch(() => {
      console.log(`${helpers.CourtSubscriptionCheckbox1} not found`);
    });
    const element = await $(helpers.CourtSubscriptionCheckbox1);

    return element.isSelected();
  }
}
