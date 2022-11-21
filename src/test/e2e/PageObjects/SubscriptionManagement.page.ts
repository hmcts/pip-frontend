import { SubscriptionAddPage } from './SubscriptionAdd.page';
import { DeleteSubscriptionPage } from './DeleteSubscription.page';
import { BulkDeleteSubscriptionsPage } from './BulkDeleteSubscriptions.page';
import { CommonPage } from './Common.page';
import { SearchPage } from './Search.page';

const helpers = require('../Helpers/Selectors');

export class SubscriptionManagementPage extends CommonPage {
  async clickAddNewSubscriptionButton(): Promise<SubscriptionAddPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    await $(helpers.ContinueButton).click();
    return new SubscriptionAddPage();
  }

  async clickBulkDeleteSubscriptionsButton(): Promise<BulkDeleteSubscriptionsPage> {
    $(helpers.SubscriptionManagementBulkDeleteSubscriptionsButton).catch(() => {
      console.log(`${helpers.SubscriptionManagementBulkDeleteSubscriptionsButton} not found`);
    });

    await $(helpers.SubscriptionManagementBulkDeleteSubscriptionsButton).click();
    return new BulkDeleteSubscriptionsPage();
  }

  async clickUnsubscribeFromFirstRecord(): Promise<DeleteSubscriptionPage> {
    $(helpers.SubscriptionManagementTableFirstResultUrl).catch(() => {
      console.log(`${helpers.SubscriptionManagementTableFirstResultUrl} not found`);
    });

    await $(helpers.SubscriptionManagementTableFirstResultUrl).click();
    return new DeleteSubscriptionPage();
  }

  async clickFindCourtNavLink(): Promise<SearchPage> {
    await $(helpers.SignedInBannerFindCourt).catch(() => {
      console.log(`${helpers.SignedInBannerFindCourt} not found`);
    });

    await $(helpers.SignedInBannerFindCourt).click();
    return new SearchPage();
  }
}
