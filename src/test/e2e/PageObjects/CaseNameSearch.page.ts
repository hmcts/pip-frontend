import { CaseNameSearchResultsPage } from "./CaseNameSearchResults.page";
import { CommonPage } from "./Common.page";

const helpers = require("../Helpers/Selectors");

export class CaseNameSearchPage extends CommonPage {
  async enterText(text: string): Promise<void> {
    $(helpers.CaseNameInput).catch(() => {
      console.log(`${helpers.CaseNameInput} not found`);
    });

    const caseNameInput = await $(helpers.CaseNameInput);
    await caseNameInput.addValue(text);
    await browser.keys("Escape");
  }

  async clickContinue(): Promise<CaseNameSearchResultsPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    const button = await $(helpers.ContinueButton);
    button.click();
    return new CaseNameSearchResultsPage();
  }
}
