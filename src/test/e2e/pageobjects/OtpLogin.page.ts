import { SubscriptionManagementPage } from './SubscriptionManagement.page';

const helpers = require('../Helpers/Selectors');

export class OtpLoginPage {

  async getPageTitle(): Promise<string> {
    $(helpers.CommonPageTitle).catch(() => {
      console.log(`${helpers.CommonPageTitle} not found`);
    });

    return $(helpers.CommonPageTitle).getText();
  }

  async enterText(text: string): Promise<void> {
    $(helpers.OtpInput).catch(() => {
      console.log(`${helpers.OtpInput} not found`);
    });

    const searchInput = await $(helpers.OtpInput);
    await searchInput.addValue(text);
    await browser.keys('Escape');
  }

  async clickContinue(): Promise<SubscriptionManagementPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    const button = await $(helpers.ContinueButton);
    button.click();
    return new SubscriptionManagementPage();
  }
}
