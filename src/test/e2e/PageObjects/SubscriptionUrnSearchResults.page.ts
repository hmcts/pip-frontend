import { CommonPage } from './Common.page';
import { PendingSubscriptionsPage } from './PendingSubscriptions.page';

const helpers = require('../Helpers/Selectors');

export class SubscriptionUrnSearchResultsPage extends CommonPage {
    async getPageTitle(): Promise<string> {
        $(helpers.SearchResultTitle).catch(() => {
            console.log(`${helpers.SearchResultTitle} not found`);
        });

        return $(helpers.SearchResultTitle).getText();
    }

    async getResults(): Promise<number> {
        $(helpers.Results).catch(() => {
            console.log(`${helpers.Results} not found`);
        });

        const results = $$(helpers.Results);
        return results.length;
    }

    async clickContinue(): Promise<PendingSubscriptionsPage> {
        $(helpers.ContinueButton).catch(() => {
            console.log(`${helpers.ContinueButton} not found`);
        });

        const button = await $(helpers.ContinueButton);
        await button.click();
        return new PendingSubscriptionsPage();
    }
}
