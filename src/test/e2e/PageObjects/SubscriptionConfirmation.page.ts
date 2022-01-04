import { SubscriptionConfirmedPage } from './SubscriptionConfirmed.page';
import { CommonPage } from './Common.page';

const helpers = require('../Helpers/Selectors');

export class SubscriptionConfirmationPage extends CommonPage{
  async getResults(): Promise<number> {
    $(helpers.Results).catch(() => {
      console.log(`${helpers.Results} not found`);
    });

    const results = $$(helpers.Results);
    return results.length;
  }

  async clickContinue(): Promise<SubscriptionConfirmedPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    const button = await $(helpers.ContinueButton);
    button.click();
    return new SubscriptionConfirmedPage();
  }

}
