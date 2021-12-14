import { LiveCaseCourtSearchControllerPage } from '../pageobjects/LiveCaseCourtSearchController.page';
import { SearchOptionsPage } from '../pageobjects/SearchOptions.page';
import { SingleJusticeProcedurePage } from '../PageObjects/SingleJusticeProcedure.page';
import { CommonPage } from '../PageObjects/Common.page';

const helpers = require('../Helpers/Selectors');

export class ViewOptionPage extends CommonPage {
  async getPageTitle(): Promise<string> {
    $(helpers.ViewOptionsTitle).catch(() => {
      console.log(`${helpers.ViewOptionsTitle} not found`);
    });

    return $(helpers.ViewOptionsTitle).getText();
  }

  async clickContinueForSearch(): Promise<SearchOptionsPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });
    const continueButton = await $(helpers.ContinueButton);
    continueButton.click();

    return new SearchOptionsPage();
  }

  async clickContinueForLiveHearings(): Promise<LiveCaseCourtSearchControllerPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });
    const continueButton = await $(helpers.ContinueButton);
    continueButton.click();

    return new LiveCaseCourtSearchControllerPage();
  }

  async clickContinueSingleJusticeProcedure(): Promise<SingleJusticeProcedurePage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });
    const continueButton = await $(helpers.ContinueButton);
    continueButton.click();

    return new SingleJusticeProcedurePage();
  }
}
