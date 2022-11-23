import { CommonPage } from './Common.page';
import { CreateSystemAdminAccountPage } from './CreateSystemAdminAccount.page';
import {SessionLoggedOutPage} from './SessionLoggedOut.page';
import {ManualReferenceDataUploadPage} from './ManualReferenceDataUpload.page';
import { BlobViewLocationsPage } from './BlobViewLocationsPage';

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

  async clickBlobExplorerLocationsCard(): Promise<BlobViewLocationsPage> {
    await $(helpers.BlobExplorerLocations).catch(() => {
      console.log(`${helpers.BlobExplorerLocations} not found`);
    });

    await $(helpers.BlobExplorerLocations).click();
    return new BlobViewLocationsPage();
  }

  async clickSignOut(): Promise<SessionLoggedOutPage> {
    await $(helpers.SignedInBannerSignOut).catch(() => {
      console.log(`${helpers.SignedInBannerSignOut} not found`);
    });

    await $(helpers.SignedInBannerSignOut).click();
    return new SessionLoggedOutPage();
  }
}
