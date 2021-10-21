import {SubscriptionCaseSearchPage} from './SubscriptionCaseSearch.page';

const helpers = require('../Helpers/Selectors');

export class SubscriptionAddPage {

  open(path): Promise<string> {
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

  async selectCaseSearchRadio(): Promise<void> {
    $(helpers.CaseSearchRadioButton).catch(() => {
      console.log(`${helpers.CaseSearchRadioButton} not found`);
    });
    const radioButton = await $(helpers.CaseSearchRadioButton);
    radioButton.click();
  }

  async clickContinueForCaseSearch(): Promise<SubscriptionCaseSearchPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });
    const continueButton = await $(helpers.ContinueButton);
    continueButton.click();

    return new SubscriptionCaseSearchPage();
  }
}
