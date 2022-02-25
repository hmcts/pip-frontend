import { CommonPage } from './Common.page';
import { DailyCauseListPage } from './DailyCauseList.page';
import { SignInPage } from './SignIn.page';

const helpers = require('../Helpers/Selectors');

export class SummaryOfPublicationsPage extends CommonPage{
  async getResults(): Promise<number> {
    $(helpers.Results).catch(() => {
      console.log(`${helpers.Results} not found`);
    });
    const results = $$(helpers.Results);
    return results.length;
  }

  async clickSOPListItem(): Promise<DailyCauseListPage> {
    $(helpers.SOPListItem).catch(() => {
      console.log(`${helpers.SOPListItem} not found`);
    });

    await $(helpers.SOPListItem).click();
    return new DailyCauseListPage();
  }

  async clickSignInBannerLink(): Promise<SignInPage> {
    $(helpers.BannerSignIn).catch(() => {
      console.log(`${helpers.BannerSignIn} not found`);
    });

    await $(helpers.BannerSignIn).click();
    return new SignInPage();
  }
}
