import { SubscriptionManagementPage } from './SubscriptionManagement.page';

const helpers = require('../Helpers/Selectors');

export class MockSessionPage {
  open (path): Promise<string> {
    return browser.url(path);
  }

  async getPageTitle(): Promise<string> {
    $(helpers.CommonPageTitle).catch(() => {
      console.log(`${helpers.CommonPageTitle} not found`);
    });

    return $(helpers.CommonPageTitle).getText();
  }

  async enterText(text: string, field: string): Promise<void> {
    $(helpers[field]).catch(() => {
      console.log(`${helpers[field]} not found`);
    });

    const inputField = await $(helpers[field]);
    await inputField.addValue(text);
    await browser.keys('Escape');
  }

  async selectOption(optionName: string): Promise<void> {
    $(helpers[optionName]).catch(() => {
      console.log(`${helpers[optionName]} not found`);
    });

    await $(helpers[optionName]).click();
  }

  async clickContinue(): Promise<SubscriptionManagementPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    await $(helpers.ContinueButton).click();
    return new SubscriptionManagementPage();
  }
}
