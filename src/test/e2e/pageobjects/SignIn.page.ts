import { CommonPage } from './Common.page';

const helpers = require('../Helpers/Selectors');
const authConfig = require('../authentication/authentication-config.json');
const pAndIRedirectUrl = `${authConfig.AUTHORISATION_ENDPOINT}?p=${authConfig.PI_FLOW_NAME}&client_id=${authConfig.CLIENT_ID}&nonce=defaultNonce&redirect_uri=${authConfig.REDIRECT_URI}&scope=openid&response_type=id_token&prompt=login`;

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

  async clickContinueForRadio3(): Promise<string> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });
    const continueButton = await $(helpers.ContinueButton);
    continueButton.click();

    return pAndIRedirectUrl;
  }

}
