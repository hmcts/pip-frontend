import { CommonPage } from './Common.page';

const helpers = require('../Helpers/Selectors');

export class CourtNameSearchPage extends CommonPage{
  async getResults(): Promise<number> {
    $(helpers.CourtTableResults).catch(() => {
      console.log(`${helpers.CourtTableResults} not found`);
    });
    const results = $$(helpers.CourtTableResults);
    return results.length;
  }

  async jurisdictionChecked(): Promise<boolean> {
    await $(helpers.JurisdictionCheckbox).catch(() => {
      console.log(`${helpers.JurisdictionCheckbox} not found`);
    });
    const element = await $(helpers.JurisdictionCheckbox);

    return element.isSelected();
  }

  async clickApplyFiltersButton(): Promise<CourtNameSearchPage> {
    await $(helpers.ApplyFiltersButton).catch(() => {
      console.log(`${helpers.ApplyFiltersButton} not found`);
    });

    await $(helpers.ApplyFiltersButton).click();
    return new CourtNameSearchPage();
  }

  async clickClearFiltersButton(): Promise<CourtNameSearchPage> {
    await $(helpers.ClearFiltersLink).catch(() => {
      console.log(`${helpers.ClearFiltersLink} not found`);
    });

    await $(helpers.ClearFiltersLink).click();
    return new CourtNameSearchPage();
  }
}
