import { CommonPage } from './Common.page';
import { UnsubscribeConfirmationPage } from './UnsubscribeConfirmation.page';

const helpers = require('../Helpers/Selectors');

export class DeleteSubscriptionPage extends CommonPage {
    async clickContinueForYes(): Promise<UnsubscribeConfirmationPage> {
        $(helpers.ContinueButton).catch(() => {
            console.log(`${helpers.ContinueButton} not found`);
        });

        await $(helpers.ContinueButton).click();
        return new UnsubscribeConfirmationPage();
    }
}
