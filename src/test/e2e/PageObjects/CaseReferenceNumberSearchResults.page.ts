import { CommonPage } from './Common.page';
import { PendingSubscriptionsPage } from './PendingSubscriptions.page';

const helpers = require('../Helpers/Selectors');

export class CaseReferenceNumberSearchResultsPage extends CommonPage {
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
