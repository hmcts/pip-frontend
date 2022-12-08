import { CommonPage } from './Common.page';
import { CourtListPage } from './CourtList.page';
import { SignInPage } from './SignIn.page';
import { AccountHomePage } from './AccountHome.page';

const helpers = require('../Helpers/Selectors');

export class SummaryOfPublicationsPage extends CommonPage{
  async getResults(): Promise<number> {
    $(helpers.Results).catch(() => {
      console.log(`${helpers.Results} not found`);
    });
    const results = $$(helpers.Results);
    return results.length;
  }

  async clickSOPListItem(): Promise<CourtListPage> {
    $(helpers.SOPListItem).catch(() => {
      console.log(`${helpers.SOPListItem} not found`);
    });

    await $(helpers.SOPListItem).click();
    return new CourtListPage();
  }

  async clickSignInBannerLink(): Promise<SignInPage> {
    $(helpers.BannerSignIn).catch(() => {
      console.log(`${helpers.BannerSignIn} not found`);
    });

    await $(helpers.BannerSignIn).click();
    return new SignInPage();
  }

  async clickSignedInHomeBannerLink(): Promise<AccountHomePage> {
    $(helpers.BannerHome).catch(() => {
      console.log(`${helpers.BannerHome} not found`);
    });

    await $(helpers.BannerHome).click();
    return new AccountHomePage();
  }
}
