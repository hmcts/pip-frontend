import { ViewOptionPage } from './ViewOption.page';
import { SubscriptionManagementPage } from './SubscriptionManagement.page';
import {SubscriptionAddPage} from './SubscriptionAdd.page';

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

  async clickSignInButton(): Promise<SubscriptionManagementPage> {
    const button = await $(helpers.SignInButton);
    button.click();
    return new SubscriptionManagementPage();
  }

  async clickSubscriptionAddButton(): Promise<SubscriptionAddPage> {
    const button = await $(helpers.SignInMenu);
    button[4].click();
    return new SubscriptionAddPage();
  }
}
