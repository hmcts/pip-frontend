import {SubscriptionUrnSearchPage} from '../pageobjects/SubscriptionUrnSearch.page';
import { CaseNameSearchPage } from '../PageObjects/CaseNameSearch.page';
import { CourtNameSearchPage } from '../PageObjects/CourtNameSearch.page';
import { CommonPage } from '../PageObjects/Common.page';

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

    await $(helpers.ContinueButton).click();
    return new CaseNameSearchPage();
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
