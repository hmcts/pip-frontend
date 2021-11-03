import { SubscriptionUrnSearchPage } from './SubscriptionUrnSearch.page';
import { CaseNameSearchPage } from './CaseNameSearch.page';
import { PageBase } from './Base/PageBase.page';
import { CourtNameSearchPage } from './CourtNameSearch.page';

const helpers = require('../Helpers/Selectors');

export class SubscriptionAddPage extends PageBase {
  async getPageTitle(): Promise<string> {
    $(helpers.SubscriptionAddTitle).catch(() => {
      console.log(`${helpers.SubscriptionAddTitle} not found`);
    });

    return $(helpers.SubscriptionAddTitle).getText();
  }

  get radioButtons(): Promise<number> {
    const radioButtons = $$(helpers.RadioButton);
    return radioButtons.length;
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

  async clickContinueForUrnSearch(): Promise<SubscriptionUrnSearchPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });
    const continueButton = await $(helpers.ContinueButton);
    continueButton.click();

    return new SubscriptionUrnSearchPage();
  }
}
