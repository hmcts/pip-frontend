import { AlphabeticalSearchPage } from '../pageobjects/AlphabeticalSearch.page';
import { SearchPage } from '../pageobjects/Search.page';
import { CommonPage } from '../PageObjects/Common.page';

const helpers = require('../Helpers/Selectors');

export class SearchOptionsPage extends CommonPage {
  async getPageTitle(): Promise<string> {
    $(helpers.SearchOptionsTitle).catch(() => {
      console.log(`${helpers.SearchOptionsTitle} not found`);
    });

    return $(helpers.SearchOptionsTitle).getText();
  }

  async clickContinueForSearch(): Promise<SearchPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });
    const continueButton = await $(helpers.ContinueButton);
    continueButton.click();

    return new SearchPage();
  }

  async clickContinueForAlphabetical(): Promise<AlphabeticalSearchPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });
    const continueButton = await $(helpers.ContinueButton);
    continueButton.click();

    return new AlphabeticalSearchPage();
  }
}
