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

    get SubscriptionTable(): Promise<number> {
        const items = $$(helpers.SubscriptionTableHeading);
        return items.length;
    }

    async getSubscriptionTableColumnHeader(): Promise<string> {
        $(helpers.SubscriptionTableHeader).catch(() => {
            console.log(`${helpers.SubscriptionTableHeader} not found`);
        });

        return $(helpers.SubscriptionTableHeader).getText();
    }
}
