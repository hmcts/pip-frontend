const helpers = require('../Helpers/Selectors');

export class OtpLoginTestingPage {

  open (path): Promise<string> {
    return browser.url(path);
  }

  async getPageTitle(): Promise<string> {
    $(helpers.CommonPageTitle).catch(() => {
      console.log(`${helpers.CommonPageTitle} not found`);
    });

    return $(helpers.CommonPageTitle).getText();
  }
}
