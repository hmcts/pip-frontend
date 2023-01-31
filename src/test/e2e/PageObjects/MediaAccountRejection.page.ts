import { CommonPage } from './Common.page';
import { MediaAccountRejectionConfirmationPage } from './MediaAccountRejectionConfirmation.page';

const helpers = require('../Helpers/Selectors');

export class MediaAccountRejectionPage extends CommonPage {
    async selectYes(): Promise<void> {
        $(helpers.MediaAccountRejectionYes).catch(() => {
            console.log(`${helpers.MediaAccountRejectionYes} not found`);
        });

        await $(helpers.MediaAccountRejectionYes).click();
    }

    async clickContinue(): Promise<MediaAccountRejectionConfirmationPage> {
        $(helpers.ContinueButton).catch(() => {
            console.log(`${helpers.ContinueButton} not found`);
        });

        await $(helpers.ContinueButton).click();
        return new MediaAccountRejectionConfirmationPage();
    }
}
