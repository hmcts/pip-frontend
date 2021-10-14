const helpers = require('../Helpers/Selectors');

export class CaseNameSearchResultsPage {
  async getPageTitle(): Promise<string> {
    $(helpers.CommonPageTitle).catch(() => {
      console.log(`${helpers.CommonPageTitle} not found`);
    });

    return $(helpers.CommonPageTitle).getText();
  }

  async getResults(): Promise<number> {
    $(helpers.Results).catch(() => {
      console.log(`${helpers.Results} not found`);
    });
    const results = $$(helpers.Results);
    return results.length;
  }

  async tickHeaderCheckbox(): Promise<boolean> {
    $(helpers.CaseNameSearchResultsHeaderCheckbox).catch(() => {
      console.log(`${helpers.CaseNameSearchResultsHeaderCheckbox} not found`);
    });

    await $(helpers.CaseNameSearchResultsHeaderCheckbox).click();

    return $(helpers.CaseNameSearchResultsHeaderCheckbox).isSelected();
  }

  async tickResultCheckbox(): Promise<boolean> {
    $(helpers.CaseNameSearchResultsCheckbox).catch(() => {
      console.log(`${helpers.CaseNameSearchResultsCheckbox} not found`);
    });

    await $(helpers.CaseNameSearchResultsCheckbox).click();

    return $(helpers.CaseNameSearchResultsCheckbox).isSelected();
  }
}
