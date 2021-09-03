const helpers = require('../Helpers/Selectors');

export class AlphabeticalSearchPage {

  get pageTitle() {
    return $(helpers.CommonPageTitle);
  }

  async selectLetter(letter) {
    const letterLink = await $(helpers.KeySelector(letter));
    letterLink.click();
  }

  async checkIfLetterIsVisible(letter) {
    const element = await $(helpers.RowSelector(letter));
    return await element.isDisplayedInViewport();
  }
}
