import { CaseNameSearchPage } from './CaseNameSearch.page';

import { CourtNameSearchPage } from './CourtNameSearch.page';

const helpers = require('../Helpers/Selectors');

export class SubscriptionAddPage {
  open (path): Promise<string> {
    return browser.url(path);
  }

  async getPageTitle(): Promise<string> {
    $(helpers.SubscriptionAddTitle).catch(() => {
      console.log(`${helpers.SubscriptionAddTitle} not found`);
    });

    return $(helpers.SubscriptionAddTitle).getText();
  }

  async selectOption(optionName: string): Promise<void> {
    $(helpers[optionName]).catch(() => {
      console.log(`${helpers[optionName]} not found`);
    });

    await $(helpers[optionName]).click();
  }

  // TODO: add remaining clicks

  async clickContinueForCaseName(): Promise<CaseNameSearchPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    await $(helpers.ContinueButton).click();
    return new CaseNameSearchPage();
  }

  async clickContinueForCourtOrTribunal(): Promise<CourtNameSearchPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    await $(helpers.ContinueButton).click();
    return new CourtNameSearchPage();
  }
}
