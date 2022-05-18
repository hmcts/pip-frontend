import { CommonPage } from './Common.page';
import { ManualUploadPage } from './ManualUpload.page';
import { CreateAdminAccountPage } from './CreateAdminAccount.page';
import { RemoveListSearchPage } from './RemoveListSearch.page';
import {ViewOptionPage} from './ViewOption.page';

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

  async clickSignOut(): Promise<ViewOptionPage> {
    await $(helpers.SignedInBannerSignOut).catch(() => {
      console.log(`${helpers.SignedInBannerSignOut} not found`);
    });

    await $(helpers.SignedInBannerSignOut).click();
    return new ViewOptionPage();
  }
}
