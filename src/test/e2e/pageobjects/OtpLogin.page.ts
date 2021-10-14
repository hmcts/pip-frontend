import { SubscriptionManagementPage } from './SubscriptionManagement.page';
import {PageBase} from './Base/PageBase.page';

const helpers = require('../Helpers/Selectors');

export class OtpLoginPage extends PageBase {

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
