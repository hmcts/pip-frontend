const helpers = require('../Helpers/Selectors');

export class SingleJusticeProcedurePage {

  async getPageTitle(): Promise<string> {
    $(helpers.CommonPageTitle).catch(() => {
      console.log(`${helpers.CommonPageTitle} not found`);
    });

    return $(helpers.CommonPageTitle).getText();
  }
}
