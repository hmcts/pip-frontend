import { SubscriptionManagementPage } from './SubscriptionManagement.page';
import {PageBase} from './Base/PageBase.page';

const helpers = require('../Helpers/Selectors');

export class IdamSigninPage extends PageBase {

  async selectIdam(text): Promise<void> {
    $(helpers.IdamSiginInput).catch(() => {
      console.log(`${helpers.IdamSiginInput} not found`);
    });
    const selectInput = await $(helpers.IdamSiginInput);
    selectInput.selectByVisibleText(text);
  }

  async clickContinue(): Promise<SubscriptionManagementPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    const button = await $(helpers.ContinueButton);
    button.click();
    return new SubscriptionManagementPage();
  }
}
