import { CommonPage } from './Common.page';
import { DeleteCourtReferenceConfirmationPage } from './DeleteCourtReferenceConfirmation.page';
const helpers = require('../Helpers/Selectors');

export class DeleteCourtReferenceDataPage extends CommonPage {
    async getPageTitle(): Promise<string> {
        $(helpers.CommonPageTitle).catch(() => {
            console.log(`${helpers.CommonPageTitle} not found`);
        });

        return $(helpers.CommonPageTitle).getText();
    }

    async enterText(text: string): Promise<void> {
        $(helpers.SearchInput).catch(() => {
            console.log(`${helpers.SearchInput} not found`);
        });

        const searchInput = await $(helpers.SearchInput);
        await searchInput.addValue(text);
        await browser.keys('Escape');
    }

    async clickContinue(): Promise<DeleteCourtReferenceConfirmationPage> {
        $(helpers.ContinueButton).catch(() => {
            console.log(`${helpers.ContinueButton} not found`);
        });

        await $(helpers.ContinueButton).click();
        return new DeleteCourtReferenceConfirmationPage();
    }
}
