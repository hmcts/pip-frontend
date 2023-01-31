import { CommonPage } from './Common.page';
import { RemoveListConfirmationPage } from './RemoveListConfirmation.page';

const helpers = require('../Helpers/Selectors');

export class RemoveListSearchResultsPage extends CommonPage {
    async clickRemoveOnFirstRecord(): Promise<RemoveListConfirmationPage> {
        $(helpers.SubscriptionManagementTableFirstResultUrl).catch(() => {
            console.log(`${helpers.SubscriptionManagementTableFirstResultUrl} not found`);
        });

        await $(helpers.SubscriptionManagementTableFirstResultUrl).click();
        return new RemoveListConfirmationPage();
    }
}
