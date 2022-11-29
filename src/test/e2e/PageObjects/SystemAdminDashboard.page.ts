import { CommonPage } from './Common.page';
import { CreateSystemAdminAccountPage } from './CreateSystemAdminAccount.page';
import {SessionLoggedOutPage} from './SessionLoggedOut.page';
import {ManualReferenceDataUploadPage} from './ManualReferenceDataUpload.page';
import {DeleteCourtReferenceDataPage} from './DeleteCourtReferenceData.page';
import {ManageThirdPartyUsersPage} from './ManageThirdPartyUsers.page';
import {UserManagementPage} from './UserManagement.page';
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

  async clickDeleteCourtCard(): Promise<DeleteCourtReferenceDataPage> {
    await $(helpers.DeleteCourt).catch(() => {
      console.log(`${helpers.DeleteCourt} not found`);
    });

    await $(helpers.DeleteCourt).click();
    return new DeleteCourtReferenceDataPage();
  }

  async clickManageThirdPartyUsersCard(): Promise<ManageThirdPartyUsersPage> {
    await $(helpers.ManageThirdPartyUsers).catch(() => {
      console.log(`${helpers.ManageThirdPartyUsers} not found`);
    });

    await $(helpers.ManageThirdPartyUsers).click();
    return new ManageThirdPartyUsersPage();
  }

  async clickUserManagementCard(): Promise<UserManagementPage> {
    await $(helpers.userManagement).catch(() => {
      console.log(`${helpers.userManagement} not found`);
    });

    await $(helpers.userManagement).click();
    return new UserManagementPage();
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

  async getPageTitle(): Promise<string> {
    $(helpers.CommonPageTitle).catch(() => {
      console.log(`${helpers.CommonPageTitle} not found`);
    });

    return $(helpers.CommonPageTitle).getText();
  }
}
