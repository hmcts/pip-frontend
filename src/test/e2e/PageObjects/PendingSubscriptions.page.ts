import { CommonPage } from './Common.page';
import { SubscriptionConfirmedPage } from './SubscriptionConfirmed.page';

const helpers = require('../Helpers/Selectors');

export class PendingSubscriptionsPage extends CommonPage {
    async clickContinue(): Promise<SubscriptionConfirmedPage> {
        $(helpers.ContinueButton).catch(() => {
            console.log(`${helpers.ContinueButton} not found`);
        });

        const button = await $(helpers.ContinueButton);
        await button.click();
        return new SubscriptionConfirmedPage();
    }
}
