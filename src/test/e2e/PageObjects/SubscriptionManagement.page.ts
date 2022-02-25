import { SubscriptionAddPage } from './SubscriptionAdd.page';
import { DeleteSubscriptionPage } from './DeleteSubscription.page';
import { CommonPage } from './Common.page';
import { SearchPage } from './Search.page';
import { AccountHomePage } from './AccountHome.page';

const helpers = require('../Helpers/Selectors');

export class SubscriptionManagementPage extends CommonPage {
  async clickAddNewSubscriptionButton(): Promise<SubscriptionAddPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    await $(helpers.ContinueButton).click();
    return new SubscriptionAddPage();
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

  async clickSignedInHomeBannerLink(): Promise<AccountHomePage> {
    $(helpers.BannerHome).catch(() => {
      console.log(`${helpers.BannerHome} not found`);
    });

    await $(helpers.BannerHome).click();
    return new AccountHomePage();
  }
}
