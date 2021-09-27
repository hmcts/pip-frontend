const helpers = require('../Helpers/Selectors');

export class LiveCaseStatusPage {
  async getPageTitle(): Promise<string> {
    $(helpers.CommonPageTitle).catch(() => {
      console.log(`${helpers.CommonPageTitle} not found`);
    });

    return $(helpers.CommonPageTitle).getText();
  }

  async getCourtTitle(): Promise<string> {
    $(helpers.CommonPageTitleM).catch(() => {
      console.log(`${helpers.CommonPageTitleM} not found`);
    });

    return $(helpers.CommonPageTitleM).getText();
  }

  async getResults(): Promise<number> {
    $(helpers.Results).catch(() => {
      console.log(`${helpers.Results} not found`);
    });
    const results = $$(helpers.Results);
    return results.length;
  }
}
