const helpers = require('../Helpers/Selectors');

export class SearchOptionsPage {

  get pageTitle() {
    return $(helpers.SearchOptionsTitle);
  }
}
