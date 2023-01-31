import { CommonPage } from './Common.page';
import { RemoveListSearchResultsPage } from './RemoveListSearchResults.page';

const helpers = require('../Helpers/Selectors');

export class RemoveListSearchPage extends CommonPage {
    async enterText(text: string): Promise<void> {
        $(helpers.SearchInput).catch(() => {
            console.log(`${helpers.SearchInput} not found`);
        });

        const searchInput = await $(helpers.SearchInput);
        await searchInput.addValue(text);
        await browser.keys('Escape');
    }

    async clickContinue(): Promise<RemoveListSearchResultsPage> {
        $(helpers.ContinueButton).catch(() => {
            console.log(`${helpers.ContinueButton} not found`);
        });

        await $(helpers.ContinueButton).click();
        return new RemoveListSearchResultsPage();
    }
}
