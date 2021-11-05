import {SubscriptionUrnSearchPage} from './SubscriptionUrnSearch.page';
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

  get radioButtons(): Promise<number> {
    const radioButtons = $$(helpers.RadioButton);
    return radioButtons.length;
  }

  async selectUrnSearchRadio(): Promise<void> {
    $(helpers.UrnSearchRadioButton).catch(() => {
      console.log(`${helpers.UrnSearchRadioButton} not found`);
    });
    const radioButton = await $(helpers.UrnSearchRadioButton);
    radioButton.click();
  }

  async clickContinueForUrnSearch(): Promise<SubscriptionUrnSearchPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });
    const continueButton = await $(helpers.ContinueButton);
    continueButton.click();

    return new SubscriptionUrnSearchPage();
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
