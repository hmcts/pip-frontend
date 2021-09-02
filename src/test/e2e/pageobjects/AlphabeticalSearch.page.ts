const helpers = require('../Helpers/Selectors');

export class AlphabeticalSearchPage {

  get pageTitle() {
    return $(helpers.CommonPageTitle);
  }

  async selectLetter(letter) {
    await $(helpers.KeySelector(letter)).click;
  }
}
