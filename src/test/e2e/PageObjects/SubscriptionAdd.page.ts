import { CourtNameSearchPage } from './CourtNameSearch.page';

const helpers = require('../Helpers/Selectors');

export class SubscriptionAddPage {
  async getPageTitle(): Promise<string> {
    $(helpers.SubscriptionAddTitle).catch(() => {
      console.log(`${helpers.SubscriptionAddTitle} not found`);
    });

    return $(helpers.SubscriptionAddTitle).getText();
  }

  async selectCaseReferenceNumberOption(): Promise<void> {
    $(helpers.SubscriptionAddByCaseRefNumber).catch(() => {
      console.log(`${helpers.SubscriptionAddByCaseRefNumber} not found`);
    });

    await $(helpers.SubscriptionAddByCaseRefNumber).click();
  }

  async selectUniqueReferenceNumberOption(): Promise<void> {
    $(helpers.SubscriptionAddByUniqueRefNumber).catch(() => {
      console.log(`${helpers.SubscriptionAddByUniqueRefNumber} not found`);
    });

    await $(helpers.SubscriptionAddByUniqueRefNumber).click();
  }

  async selectCaseNameOption(): Promise<void> {
    $(helpers.SubscriptionAddByCaseName).catch(() => {
      console.log(`${helpers.SubscriptionAddByCaseName} not found`);
    });

    await $(helpers.SubscriptionAddByCaseName).click();
  }

  async selectCourtOrTribunalOption(): Promise<void> {
    $(helpers.SubscriptionAddByCourtOrTribunal).catch(() => {
      console.log(`${helpers.SubscriptionAddByCourtOrTribunal} not found`);
    });

    await $(helpers.SubscriptionAddByCourtOrTribunal).click();
  }


  // TODO: add remaining clicks

  async clickContinueForCourtOrTribunal(): Promise<CourtNameSearchPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    await $(helpers.ContinueButton).click();
    return new CourtNameSearchPage();
  }
}
