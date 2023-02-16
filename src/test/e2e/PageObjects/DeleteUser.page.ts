import { CommonPage } from './Common.page';
import { UpdateUserConfirmationPage } from './UpdateUserConfirmation.page';
import { DeleteUserConfirmationPage } from './DeleteUserConfirmation.page';
const helpers = require('../Helpers/Selectors');

export class DeleteUserPage extends CommonPage {
    async getPageTitle(): Promise<string> {
        $(helpers.CommonPageTitle).catch(() => {
            console.log(`${helpers.CommonPageTitle} not found`);
        });

        return $(helpers.CommonPageTitle).getText();
    }

    async clickContinueButton(): Promise<DeleteUserConfirmationPage> {
        $(helpers.continueButton).catch(() => {
            console.log(`${helpers.continueButton} not found`);
        });
        await $(helpers.continueButton).click();

        return new UpdateUserConfirmationPage();
    }
}
