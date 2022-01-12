import { AlphabeticalSearchPage } from './AlphabeticalSearch.page';
import { SearchPage } from './Search.page';
import { CommonPage } from './Common.page';

const helpers = require('../Helpers/Selectors');

export class SignInPage extends CommonPage {
  async getPageTitle(): Promise<string> {
    $(helpers.SearchOptionsTitle).catch(() => {
      console.log(`${helpers.SearchOptionsTitle} not found`);
    });

    return $(helpers.SearchOptionsTitle).getText();
  }

  async clickContinueForRadio1(): Promise<string> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });
    const continueButton = await $(helpers.ContinueButton);
    continueButton.click();

    return 'https://google.com';
  }

  async clickContinueForRadio2(): Promise<string> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });
    const continueButton = await $(helpers.ContinueButton);
    continueButton.click();

    return 'https://google.com';
  }

  async clickContinueForRadio3(): Promise<string> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });
    const continueButton = await $(helpers.ContinueButton);
    continueButton.click();

    return 'https://google.com';
  }

}
