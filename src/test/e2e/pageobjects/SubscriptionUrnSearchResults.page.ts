import { SubscriptionConfirmationPage } from './SubscriptionConfirmation.page';
import { CommonPage } from './Common.page';

const helpers = require('../Helpers/Selectors');

export class SubscriptionUrnSearchResultsPage extends CommonPage {
  async getPageTitle(): Promise<string> {
    $(helpers.SearchResultTitle).catch(() => {
      console.log(`${helpers.SearchResultTitle} not found`);
    });

    return $(helpers.SearchResultTitle).getText();
  }

  async getResults(): Promise<number> {
    $(helpers.Results).catch(() => {
      console.log(`${helpers.Results} not found`);
    });

    const results = $$(helpers.Results);
    return results.length;
  }

  async clickContinue(): Promise<SubscriptionConfirmationPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    const button = await $(helpers.ContinueButton);
    button.click();
    return new SubscriptionConfirmationPage();
  }
}
