import { CommonPage } from './Common.page';
import { ManualUploadPage } from './ManualUpload.page';
import { CreateAdminAccountPage } from './CreateAdminAccount.page';
import { RemoveListSearchPage } from './RemoveListSearch.page';
import {MediaAccountRequestsPage} from './MediaAccountRequests.page';
import {SessionLoggedOutPage} from './SessionLoggedOut.page';

const helpers = require('../Helpers/Selectors');

export class AdminDashboardPage extends CommonPage {
  async clickUploadFileCard(): Promise<ManualUploadPage> {
    await $(helpers.UploadFile).catch(() => {
      console.log(`${helpers.UploadFile} not found`);
    });

    await $(helpers.UploadFile).click();
    return new ManualUploadPage();
  }

  async clickCreateNewAccountCard(): Promise<CreateAdminAccountPage> {
    await $(helpers.CreateAdminAccount).catch(() => {
      console.log(`${helpers.CreateAdminAccount} not found`);
    });

    await $(helpers.CreateAdminAccount).click();
    return new CreateAdminAccountPage();
  }

  async clickRemoveCard(): Promise<RemoveListSearchPage> {
    await $(helpers.RemoveContent).catch(() => {
      console.log(`${helpers.RemoveContent} not found`);
    });

    await $(helpers.RemoveContent).click();
    return new RemoveListSearchPage();
  }

  async clickManageMedia(): Promise<MediaAccountRequestsPage> {
    await $(helpers.ManageMediaAccounts).catch(() => {
      console.log(`${helpers.ManageMediaAccounts} not found`);
    });

    await $(helpers.ManageMediaAccounts).click();
    return new MediaAccountRequestsPage();
  }

  async clickSignOut(): Promise<SessionLoggedOutPage> {
    await $(helpers.SignedInBannerSignOut).catch(() => {
      console.log(`${helpers.SignedInBannerSignOut} not found`);
    });

    await $(helpers.SignedInBannerSignOut).click();
    return new SessionLoggedOutPage();
  }
}
