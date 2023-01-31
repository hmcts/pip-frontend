import { SubscriptionManagementPage } from './SubscriptionManagement.page';
import { CommonPage } from './Common.page';

const helpers = require('../Helpers/Selectors');

export class MockSessionPage extends CommonPage {
    async enterText(text: string, field: string): Promise<void> {
        $(helpers[field]).catch(() => {
            console.log(`${helpers[field]} not found`);
        });

        const inputField = await $(helpers[field]);
        await inputField.addValue(text);
        await browser.keys('Escape');
    }

    async clickContinue(): Promise<SubscriptionManagementPage> {
        $(helpers.ContinueButton).catch(() => {
            console.log(`${helpers.ContinueButton} not found`);
        });

        await $(helpers.ContinueButton).click();
        return new SubscriptionManagementPage();
    }
}
