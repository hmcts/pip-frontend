import { CommonPage } from './Common.page';
import { CaseEventGlossaryPage } from './CaseEventGlossary.page';

const helpers = require('../Helpers/Selectors');

<<<<<<< HEAD:src/test/e2e/PageObjects/LiveCaseStatus.page.ts
export class LiveCaseStatusPage extends CommonPage {
=======
export class LiveCaseStatusPage extends CommonPage{
>>>>>>> master:src/test/e2e/pageobjects/LiveCaseStatus.page.ts
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

  async selectGlossaryTerm(): Promise<CaseEventGlossaryPage> {
    $(helpers.GlossaryTerm).catch(() => {
      console.log(`${helpers.GlossaryTerm} not found`);
    });

    await $(helpers.GlossaryTerm).click();
    return new CaseEventGlossaryPage();
  }
}
