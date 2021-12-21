import { UnsubscribeConfirmationPage } from './UnsubscribeConfirmation.page';

const helpers = require('../Helpers/Selectors');

export class DeleteSubscriptionPage {
  async getPageTitle(): Promise<string> {
    $(helpers.CommonPageTitle).catch(() => {
      console.log(`${helpers.CommonPageTitle} not found`);
    });

    return $(helpers.CommonPageTitle).getText();
  }

  async selectRadioButton(radioButton: string): Promise<void> {
    $(helpers[radioButton]).catch(() => {
      console.log(`${helpers.radioButton} not found`);
    });

    const radio = await $(helpers.radioButon);
    radio.click();
  }

  async clickContinueForYes(): Promise<UnsubscribeConfirmationPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    await $(helpers.ContinueButton).click();
    return new UnsubscribeConfirmationPage();
  }
}
