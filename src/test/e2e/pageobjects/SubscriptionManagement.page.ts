import { SubscriptionAddPage } from '../PageObjects/SubscriptionAdd.page';
import { CommonPage } from '../PageObjects/Common.page';

const helpers = require('../Helpers/Selectors');

export class SubscriptionManagementPage extends CommonPage {

  async clickAddNewSubscriptionButton(): Promise<SubscriptionAddPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    await $(helpers.ContinueButton).click();
    return new SubscriptionAddPage();
  }
}
