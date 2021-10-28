const helpers = require('../Helpers/Selectors');

export class CourtNameSearchPage {
  async getPageTitle(): Promise<string> {
    $(helpers.CommonPageTitle).catch(() => {
      console.log(`${helpers.CommonPageTitle} not found`);
    });

    return $(helpers.CommonPageTitle).getText();
  }

  async selectLetter(letter): Promise<void> {
    await $(helpers.KeySelector(letter)).catch(() => {
      console.log(`${helpers.KeySelector(letter)} not found`);
    });

    const letterLink = await $(helpers.KeySelector(letter));
    letterLink.click();
  }

  async checkIfLetterIsVisible(letter): Promise<boolean> {
    const element = await $(helpers.RowSelector(letter));
    return await element.isDisplayedInViewport();
  }

  async selectBackToTop(): Promise<void> {
    await $(helpers.BackToTopButton).catch(() => {
      console.log(`${helpers.BackToTopButton} not found`);
    });

    const backToTop = await $(helpers.BackToTopButton);
    backToTop.click();
  }

  async getResults(): Promise<number> {
    $(helpers.Results).catch(() => {
      console.log(`${helpers.Results} not found`);
    });
    const results = $$(helpers.Results);
    return results.length;
  }

  async selectJurisdictionFilter(): Promise<void> {
    await $(helpers.JurisdictionCheckbox).catch(() => {
      console.log(`${helpers.JurisdictionCheckbox} not found`);
    });

    await $(helpers.JurisdictionCheckbox).click();
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
}
