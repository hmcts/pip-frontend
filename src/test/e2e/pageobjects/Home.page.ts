import { ViewOptionPage } from './ViewOption.page';
import {OtpLoginPage} from './OtpLogin.page';

const helpers = require('../Helpers/Selectors');

export class HomePage {

  open (path): Promise<string> {
    return browser.url(path);
  }

  async getPageTitle(): Promise<string> {
    $(helpers.MainHeader).catch(() => {
      console.log(`${helpers.MainHeader} not found`);
    });

    return $(helpers.MainHeader).getText();
  }

  async clickStartNowButton(): Promise<ViewOptionPage> {
    const button = await $(helpers.StartNowButton);
    button.click();
    return new ViewOptionPage();
  }

  async clickSubscriptionsButton(): Promise<OtpLoginPage> {
    const button = await $(helpers.SubscriptionsButton);
    button.click();
    return new OtpLoginPage();
  }
}
