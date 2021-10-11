import {SubscriptionCaseSearchResultsPage} from './SubscriptionCaseSearchResults.page';

const helpers = require('../Helpers/Selectors');

export class SubscriptionCaseSearchPage {

  open (path): Promise<string> {
    return browser.url(path);
  }

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

  async clickContinue(): Promise<SubscriptionCaseSearchResultsPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    const button = await $(helpers.ContinueButton);
    button.click();
    return new SubscriptionCaseSearchResultsPage();
  }
}
