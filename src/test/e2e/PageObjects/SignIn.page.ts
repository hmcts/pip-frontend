import { CommonPage } from './Common.page';
import { AccountHomePage } from './AccountHome.page';
import { CreateMediaAccountPage } from './CreateMediaAccount.page';

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

  async clickContinueForRadio3(): Promise<void> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });
    const continueButton = await $(helpers.ContinueButton);
    continueButton.click();
  }

  async enterText(text: string, field: string): Promise<void> {
    $(helpers[field]).catch(() => {
      console.log(`${helpers[field]} not found`);
    });

    const inputField = await $(helpers[field]);
    await inputField.addValue(text);
    await browser.keys('Escape');
  }

  async clickCreateAccount(): Promise<CreateMediaAccountPage> {
    $(helpers.SearchAToZLink).catch(() => {
      console.log(`${helpers.SearchAToZLink} not found`);
    });

    await $(helpers.SearchAToZLink).click();
    return new CreateMediaAccountPage();
  }

  async clickSignIn(): Promise<AccountHomePage> {
    $(helpers.UserLoginContinue).catch(() => {
      console.log(`${helpers.UserLoginContinue} not found`);
    });

    const continueButton = await $(helpers.UserLoginContinue);
    continueButton.click();

    return new AccountHomePage();
  }
}
