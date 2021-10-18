import { LiveCaseCourtSearchControllerPage } from './LiveCaseCourtSearchController.page';
import { SearchOptionsPage } from './SearchOptions.page';
import {SingleJusticeProcedureSearchPage} from './SingleJusticeProcedureSearch.page';
import {PageBase} from "./Base/PageBase.page";

const helpers = require('../Helpers/Selectors');

export class ViewOptionPage extends PageBase {

  async getPageTitle(): Promise<string> {
    $(helpers.ViewOptionsTitle).catch(() => {
      console.log(`${helpers.ViewOptionsTitle} not found`);
    });

    return $(helpers.ViewOptionsTitle).getText();
  }

  get radioButtons(): Promise<number> {
    const radioButtons = $$(helpers.RadioButton);
    return radioButtons.length;
  }

  async selectSearchRadio(): Promise<void> {
    $(helpers.ViewSearchRadioButton).catch(() => {
      console.log(`${helpers.ViewSearchRadioButton} not found`);
    });
    const radioButton = await $(helpers.ViewSearchRadioButton);
    radioButton.click();
  }

  async selectLiveHearingsRadio(): Promise<void> {
    $(helpers.LiveHearingsRadioButton).catch(() => {
      console.log(`${helpers.LiveHearingsRadioButton} not found`);
    });
    const radioButton = await $(helpers.LiveHearingsRadioButton);
    radioButton.click();
  }

  async selectSingleJusticeProcedureRadio(): Promise<void> {
    $(helpers.SingleJusticeProcedureRadioButton).catch(() => {
      console.log(`${helpers.SingleJusticeProcedureRadioButton} not found`);
    });
    const radioButton = await $(helpers.SingleJusticeProcedureRadioButton);
    radioButton.click();
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

  async clickContinueSingleJusticeProcedure(): Promise<SingleJusticeProcedureSearchPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });
    const continueButton = await $(helpers.ContinueButton);
    continueButton.click();

    return new SingleJusticeProcedureSearchPage();
  }
}
