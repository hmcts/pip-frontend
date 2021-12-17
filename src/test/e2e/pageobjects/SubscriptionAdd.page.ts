import {SubscriptionUrnSearchPage} from './SubscriptionUrnSearch.page';
import { CaseNameSearchPage } from './CaseNameSearch.page';
import { CourtNameSearchPage } from './CourtNameSearch.page';
import {CaseReferenceNumberSearchPage} from './CaseReferenceNumberSearch.page';
import { CommonPage } from './Common.page';

const helpers = require('../Helpers/Selectors');

export class SubscriptionAddPage extends CommonPage {
  async getPageTitle(): Promise<string> {
    $(helpers.SubscriptionAddTitle).catch(() => {
      console.log(`${helpers.SubscriptionAddTitle} not found`);
    });

    return $(helpers.SubscriptionAddTitle).getText();
  }

  // TODO: add remaining clicks
  async clickContinueForCaseName(): Promise<CaseNameSearchPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    const continueButton = await $(helpers.ContinueButton);
    continueButton.click();

    return new CaseNameSearchPage();
  }

  async clickContinueForCaseReferenceNumberSearch(): Promise<CaseReferenceNumberSearchPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });
    const continueButton = await $(helpers.ContinueButton);
    continueButton.click();

    return new CaseReferenceNumberSearchPage();
  }

  async selectOption(optionName: string): Promise<void> {
    $(helpers[optionName]).catch(() => {
      console.log(`${helpers[optionName]} not found`);
    });

    await $(helpers[optionName]).click();
  }

  async clickContinueForCourtOrTribunal(): Promise<CourtNameSearchPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    await $(helpers.ContinueButton).click();
    return new CourtNameSearchPage();
  }

  async clickContinueForUrnSearch(): Promise<SubscriptionUrnSearchPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    await $(helpers.ContinueButton).click();
    return new SubscriptionUrnSearchPage();
  }
}
