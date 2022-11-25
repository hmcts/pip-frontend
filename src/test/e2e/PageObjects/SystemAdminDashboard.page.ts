import { CommonPage } from './Common.page';
import { CreateSystemAdminAccountPage } from './CreateSystemAdminAccount.page';
import {SessionLoggedOutPage} from './SessionLoggedOut.page';
import {ManualReferenceDataUploadPage} from './ManualReferenceDataUpload.page';
import {DeleteCourtReferenceDataPage} from './DeleteCourtReferenceData.page';

const helpers = require('../Helpers/Selectors');

export class SystemAdminDashboardPage extends CommonPage {
  async clickCreateNewAccountCard(): Promise<CreateSystemAdminAccountPage> {
    await $(helpers.CreateSystemAdminAccount).catch(() => {
      console.log(`${helpers.CreateSystemAdminAccount} not found`);
    });

    await $(helpers.CreateSystemAdminAccount).click();
    return new CreateSystemAdminAccountPage();
  }

  async clickReferenceDataUploadFileCard(): Promise<ManualReferenceDataUploadPage> {
    await $(helpers.ReferenceDataUploadFile).catch(() => {
      console.log(`${helpers.ReferenceDataUploadFile} not found`);
    });

    await $(helpers.ReferenceDataUploadFile).click();
    return new ManualReferenceDataUploadPage();
  }

  async clickDeleteCourtCard(): Promise<DeleteCourtReferenceDataPage> {
    await $(helpers.DeleteCourt).catch(() => {
      console.log(`${helpers.DeleteCourt} not found`);
    });

    await $(helpers.DeleteCourt).click();
    return new DeleteCourtReferenceDataPage();
  }

  async clickSignOut(): Promise<SessionLoggedOutPage> {
    await $(helpers.SignedInBannerSignOut).catch(() => {
      console.log(`${helpers.SignedInBannerSignOut} not found`);
    });

    await $(helpers.SignedInBannerSignOut).click();
    return new SessionLoggedOutPage();
  }
}
