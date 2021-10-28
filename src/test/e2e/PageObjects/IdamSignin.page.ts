import {PageBase} from './Base/PageBase.page';

const helpers = require('../Helpers/Selectors');

export class IdamSigninPage extends PageBase {

  async selectSignIn(): Promise<void> {
    $(helpers.SignInButton).catch(() => {
      console.log(`${helpers.SignInButton} not found`);
    });
    const signinLink = await $(helpers.SignInButton);
    signinLink.click();
  }

  async selectIdam(text): Promise<void> {
    $(helpers.IdamSiginInput).catch(() => {
      console.log(`${helpers.IdamSiginInput} not found`);
    });
    const selectInput = await $(helpers.IdamSiginInput);
    selectInput.selectByVisibleText(text);
  }

  async clickContinue(): Promise<string> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    const button = await $(helpers.ContinueButton);
    button.click();
    return browser.url('https://www.google.com');
  }
}
