import { SearchOptionsPage } from './SearchOptions.page';

const helpers = require('../Helpers/Selectors');

export class HomePage {

  open (path): Promise<string> {
    return browser.url(`http://localhost:8080/${path}`);
  }

  async pageTitle(): Promise<string> {
    $(helpers.MainHeader).catch(() => {
      console.log(`${helpers.MainHeader} not found`);
    });

    return $(helpers.MainHeader).getText();
  }

  async clickStartNowButton(): Promise<SearchOptionsPage> {
    const button = await $(helpers.StartNowButton);
    button.click();
    return new SearchOptionsPage();
  }

}
