const helpers = require('../Helpers/Selectors');

export class HearingListPage {

  get pageTitle() {
    return $(helpers.CommonPageTitle);
  }
}
