import { CommonPage } from './Common.page';

const helpers = require('../Helpers/Selectors');

export class MediaAccountRejectionConfirmationPage extends CommonPage {
    async getPanelTitle(): Promise<string> {
        $(helpers.MediaAccountRejectionConfirmationPanelTitle).catch(() => {
            console.log(`${helpers.MediaAccountRejectionConfirmationPanelTitle} not found`);
        });

        return $(helpers.MediaAccountRejectionConfirmationPanelTitle).getText();
    }
}
