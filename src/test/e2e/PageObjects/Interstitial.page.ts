import { CommonPage } from './Common.page';
import { ViewOptionPage } from './ViewOption.page';
import * as ld from 'launchdarkly-node-client-sdk';

const user: ld.LDUser = { key: 'pip-user' };
const client: ld.LDClient = ld.initialize('62278c8e78d58e15010097cf', user);

const helpers = require('../Helpers/Selectors');

export class InterstitialPage extends CommonPage {
  async clickContinue(): Promise<ViewOptionPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });
    
    // initialization succeeded, flag values are now available
    const boolFlagValue = client.variation('key', true) as boolean;
    console.log(`It's now safe to request feature flags ${boolFlagValue}`);
    
    const button = await $(helpers.ContinueButton);
    await button.click();
    return new ViewOptionPage();
  }
}
