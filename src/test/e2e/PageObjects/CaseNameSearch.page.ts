import { CaseNameSearchResultsPage } from './CaseNameSearchResults.page';

const helpers = require('../Helpers/Selectors');

export class CaseNameSearchPage {

  async getPageTitle(): Promise<string> {
    $(helpers.CommonPageTitle).catch(() => {
      console.log(`${helpers.CommonPageTitle} not found`);
    });

    return $(helpers.CommonPageTitle).getText();
  }

  async enterText(text: string): Promise<void> {
    $(helpers.CaseNameInput).catch(() => {
      console.log(`${helpers.CaseNameInput} not found`);
    });

    const caseNameInput = await $(helpers.CaseNameInput);
    await caseNameInput.addValue(text);
    await browser.keys('Escape');
  }

  async getErrorSummaryTitle(): Promise<string> {
    $(helpers.CaseNameSearchErrorSummaryTitle).catch(() => {
      console.log(`${helpers.CaseNameSearchErrorSummaryTitle} not found`);
    });

    return $(helpers.CaseNameSearchErrorSummaryTitle).getText();
  }

  async clickContinue(): Promise<CaseNameSearchResultsPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    const button = await $(helpers.ContinueButton);
    button.click();
    return new CaseNameSearchResultsPage();
  }

  async clickContinueWithInvalidInput(): Promise<CaseNameSearchPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    const button = await $(helpers.ContinueButton);
    button.click();
    return new CaseNameSearchPage();
  }
}
