import { CommonPage } from './Common.page';
import { ViewOptionPage } from './ViewOption.page';
import {SignInPage} from './SignIn.page';

const helpers = require('../Helpers/Selectors');

export class InterstitialPage extends CommonPage {
  async clickContinue(): Promise<ViewOptionPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    const button = await $(helpers.ContinueButton);
    await button.click();
    return new ViewOptionPage();
  }

  async clickSignInBannerLink(): Promise<SignInPage> {
    $(helpers.BannerSignIn).catch(() => {
      console.log(`${helpers.BannerSignIn} not found`);
    });

    await $(helpers.BannerSignIn).click();
    return new SignInPage();
  }
}
