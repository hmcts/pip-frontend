import { SubscriptionManagementPage } from './SubscriptionManagement.page';

const helpers = require('../Helpers/Selectors');

export class IdamSigninPage {

  open (path): Promise<string> {
    return browser.url(path);
  }

  async getPageTitle(): Promise<string> {
    $(helpers.CommonPageTitle).catch(() => {
      console.log(`${helpers.CommonPageTitle} not found`);
    });

    return $(helpers.CommonPageTitle).getText();
  }

  async selectIdam(text): Promise<void> {
    $(helpers.IdamSiginInput).catch(() => {
      console.log(`${helpers.IdamSiginInput} not found`);
    });
    const selectInput = await $(helpers.IdamSiginInput);
    selectInput.selectByVisibleText(text);
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
