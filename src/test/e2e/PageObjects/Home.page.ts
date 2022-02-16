import { CommonPage } from './Common.page';
import { InterstitialPage } from './Interstitial.page';

const helpers = require('../Helpers/Selectors');

export class HomePage extends CommonPage {
  async getPageTitle(): Promise<string> {
    $(helpers.MainHeader).catch(() => {
      console.log(`${helpers.MainHeader} not found`);
    });

    return $(helpers.MainHeader).getText();
  }

  async clickLinkToService(): Promise<InterstitialPage> {
    await $(helpers.ServiceLink).click();
    return new InterstitialPage();
  }
}
