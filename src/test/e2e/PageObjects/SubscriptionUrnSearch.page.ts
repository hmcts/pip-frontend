import { SubscriptionUrnSearchResultsPage } from './SubscriptionUrnSearchResults.page';
import { CommonPage } from './Common.page';

const helpers = require('../Helpers/Selectors');

export class SubscriptionUrnSearchPage extends CommonPage {
    async getPageTitle(): Promise<string> {
        $(helpers.SearchTitle).catch(() => {
            console.log(`${helpers.SearchTitle} not found`);
        });

        return $(helpers.SearchTitle).getText();
    }

    async enterText(text: string): Promise<void> {
        $(helpers.SearchInput).catch(() => {
            console.log(`${helpers.SearchInput} not found`);
        });

        const searchInput = await $(helpers.SearchInput);
        await searchInput.addValue(text);
        await browser.keys('Escape');
    }

    async clickContinue(): Promise<SubscriptionUrnSearchResultsPage> {
        $(helpers.ContinueButton).catch(() => {
            console.log(`${helpers.ContinueButton} not found`);
        });

        const button = await $(helpers.ContinueButton);
        button.click();
        return new SubscriptionUrnSearchResultsPage();
    }
}
