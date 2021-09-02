import { AlphabeticalSearchPage } from './AlphabeticalSearch.page';

const helpers = require('../Helpers/Selectors');

export class SearchOptionsPage {

  get pageTitle() {
    return $(helpers.SearchOptionsTitle);
  }

  get radioButtons() {
    const radioButtons = $$(helpers.RadioButton);
    return radioButtons.length;
  }

  async selectFindRadio() {
    const radioButton = await $(helpers.FindRadioButton);
    radioButton.click();
  }

  async clickContinueForAlphabetical() {
    const continueButton = await $(helpers.ContinueButton);
    continueButton.click();

    return new AlphabeticalSearchPage();
  }
}
