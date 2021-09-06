import { SearchResultsPage } from './SearchResults.page';

const helpers = require('../Helpers/Selectors');

export class SearchPage {

  async pageTitle(): Promise<string> {
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
    searchInput.addValue(text);
    await browser.keys('Escape');
  }

  async clickContinue(): Promise<SearchResultsPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    const button = await $(helpers.ContinueButton);
    button.click();
    return new SearchResultsPage();
  }
}
