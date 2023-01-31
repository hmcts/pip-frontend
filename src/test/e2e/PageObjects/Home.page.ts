import { CommonPage } from './Common.page';
import { ViewOptionPage } from './ViewOption.page';

const helpers = require('../Helpers/Selectors');

export class HomePage extends CommonPage {
    async clickContinue(): Promise<ViewOptionPage> {
        $(helpers.ContinueButton).catch(() => {
            console.log(`${helpers.ContinueButton} not found`);
        });

        const button = await $(helpers.ContinueButton);
        await button.click();
        return new ViewOptionPage();
    }
}
