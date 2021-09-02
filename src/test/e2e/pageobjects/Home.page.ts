import { SearchOptionsPage } from './SearchOptions.page';

const helpers = require('../Helpers/Selectors');

export class HomePage {

  open (path) {
    return browser.url(`http://localhost:8080/${path}`);
  }

  get pageTitle() {
    return $(helpers.MainHeader);
  }

  async clickStartNowButton() {
    const button = await $(helpers.StartNowButton);
    button.click();
    return new SearchOptionsPage();
  }

}
