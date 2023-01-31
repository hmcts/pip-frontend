import { SubscriptionAddPage } from './SubscriptionAdd.page';
import { DeleteSubscriptionPage } from './DeleteSubscription.page';
import { BulkUnsubscribePage } from './BulkUnsubscribe.page';
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

    async clickBulkUnsubscribeButton(): Promise<BulkUnsubscribePage> {
        $(helpers.SubscriptionManagementBulkUnsubscribeButton).catch(() => {
            console.log(`${helpers.SubscriptionManagementBulkUnsubscribeButton} not found`);
        });

        await $(helpers.SubscriptionManagementBulkUnsubscribeButton).click();
        return new BulkUnsubscribePage();
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
