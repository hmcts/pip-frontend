import { CommonPage } from './Common.page';
import { MediaAccountRejectionPage } from './MediaAccountRejection.page';

const helpers = require('../Helpers/Selectors');

export class MediaAccountRejectionReasonsPage extends CommonPage {
    async selectReason(): Promise<void> {
        $(helpers.MediaAccountDetailsNoMatch).catch(() => {
            console.log(`${helpers.MediaAccountDetailsNoMatch} not found`);
        });

        await $(helpers.MediaAccountDetailsNoMatch).click();
    }

    async clickContinue(): Promise<MediaAccountRejectionPage> {
        $(helpers.ContinueButton).catch(() => {
            console.log(`${helpers.ContinueButton} not found`);
        });

        await $(helpers.ContinueButton).click();
        return new MediaAccountRejectionPage();
    }
}
