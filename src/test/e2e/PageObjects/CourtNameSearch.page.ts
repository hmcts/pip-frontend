import { CommonPage } from './Common.page';
import { PendingSubscriptionsPage } from './PendingSubscriptions.page';

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

  async tickCourtCheckbox(): Promise<boolean> {
    $(helpers.TribunalCourtCheckbox).catch(() => {
      console.log(`${helpers.TribunalCourtCheckbox} checkbox not found`);
    });

    await $(helpers.TribunalCourtCheckbox).click();
    return $(helpers.TribunalCourtCheckbox).isSelected();
  }

  async clickContinue(): Promise<PendingSubscriptionsPage> {
    $(helpers.CourtNameSearchContinueButton).catch(() => {
      console.log(`${helpers.CourtNameSearchContinueButton} not found`);
    });

    const button = await $(helpers.CourtNameSearchContinueButton);
    await button.click();
    return new PendingSubscriptionsPage();
  }
}
