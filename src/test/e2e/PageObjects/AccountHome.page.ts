import { CommonPage } from './Common.page';
import { SubscriptionManagementPage } from './SubscriptionManagement.page';

const helpers = require('../Helpers/Selectors');

export class AccountHomePage extends CommonPage {
  async clickSubscriptionsCard(): Promise<SubscriptionManagementPage> {
    await $(helpers.EmailSubscriptionLink).catch(() => {
      console.log(`${helpers.EmailSubscriptionLink} not found`);
    });

    await $(helpers.EmailSubscriptionLink).click();
    return new SubscriptionManagementPage();
  }
}
