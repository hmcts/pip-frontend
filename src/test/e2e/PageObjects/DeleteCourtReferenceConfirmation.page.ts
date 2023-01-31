import { CommonPage } from './Common.page';
import { DeleteCourtReferenceSuccessPage } from './DeleteCourtReferenceSuccess.page';
const helpers = require('../Helpers/Selectors');

export class DeleteCourtReferenceConfirmationPage extends CommonPage {
    async getPageTitle(): Promise<string> {
        $(helpers.CommonPageTitle).catch(() => {
            console.log(`${helpers.CommonPageTitle} not found`);
        });

        return $(helpers.CommonPageTitle).getText();
    }

    async clickContinueToDeleteCourt(): Promise<DeleteCourtReferenceSuccessPage> {
        $(helpers.ContinueButton).catch(() => {
            console.log(`${helpers.ContinueButton} not found`);
        });

        await $(helpers.ContinueButton).click();
        return new DeleteCourtReferenceSuccessPage();
    }
}
