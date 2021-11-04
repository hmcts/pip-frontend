import { AlphabeticalSearchPage } from './AlphabeticalSearch.page';
import { SearchPage } from './Search.page';

const helpers = require('../Helpers/Selectors');

export class SearchOptionsPage {

  async getPageTitle(): Promise<string> {
    $(helpers.SearchOptionsTitle).catch(() => {
      console.log(`${helpers.SearchOptionsTitle} not found`);
    });

    return $(helpers.SearchOptionsTitle).getText();
  }

  get radioButtons(): Promise<number> {
    const radioButtons = $$(helpers.RadioButton);
    return radioButtons.length;
  }

  async selectHaveTheNameRadio(): Promise<void> {
    $(helpers.SearchRadioButton).catch(() => {
      console.log(`${helpers.SearchRadioButton} not found`);
    });
    const radioButton = await $(helpers.SearchRadioButton);
    radioButton.click();
  }

  async selectDontHaveTheNameRadio(): Promise<void> {
    $(helpers.FindRadioButton).catch(() => {
      console.log(`${helpers.FindRadioButton} not found`);
    });
    const radioButton = await $(helpers.FindRadioButton);
    radioButton.click();
  }

  async selectSearchRadio(): Promise<void> {
    $(helpers.SearchRadioButton).catch(() => {
      console.log(`${helpers.SearchRadioButton} not found`);
    });
    const radioButton = await $(helpers.SearchRadioButton);
    radioButton.click();
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
