import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import {cloneDeep} from 'lodash';
import {AccountManagementRequests} from '../resources/requests/accountManagementRequests';
import {ManageUsersService} from '../service/manageUsersService';

const accountManagementRequests = new AccountManagementRequests();
const manageUsersService = new ManageUsersService();

export default class ManageUsersController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const systemAdminData = await accountManagementRequests
      .getUserByRole('SYSTEM_ADMIN');
    const superAdminData =  await accountManagementRequests
      .getUserByRole('SUPER_ADMIN');
    const adminData = await accountManagementRequests
      .getUserByRole('ADMIN');
    const thirdPartyData =  await accountManagementRequests
      .getUserByRole('THIRD_PARTY');
    const mediaData =  await accountManagementRequests
      .getUserByRole('VERIFIED');

    const systemAdminFormatted = manageUsersService.formatUserData(systemAdminData, false);
    const superAdminFormatted = manageUsersService.formatUserData(superAdminData, false);
    const adminFormatted = manageUsersService.formatUserData(adminData, false);
    const thirdPartyFormatted = manageUsersService.formatUserData(thirdPartyData, true);
    const mediaFormatted = manageUsersService.formatUserData(mediaData, true);

    const adminHeaders = [
      {
        text: 'Email',
      },
      {
        text: 'Provenance',
      },
      {
        text: 'Creation Date',
      },
      {
        text: 'Last Sign In',
      },
      {
        text: '',
      },
    ];

    const thirdPartyHeaders = [
      {
        text: 'Provenance ID',
      },
      {
        text: 'Role',
      },
      {
        text: 'Creation Date',
      },
      {
        text: '',
      },
    ];

    const mediaHeaders = [
      {
        text: 'Email',
      },
      {
        text: 'Provenance',
      },
      {
        text: 'Creation Date',
      },
      {
        text: 'Last Verified',
      },
      {
        text: '',
      },
    ];

    res.render('manage-users', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manage-users']),
      systemAdminData: systemAdminFormatted,
      superAdminData: superAdminFormatted,
      adminData: adminFormatted,
      thirdPartyData: thirdPartyFormatted,
      mediaData: mediaFormatted,
      adminHeaders: adminHeaders,
      mediaHeaders: mediaHeaders,
      thirdPartyHeaders: thirdPartyHeaders,
    });
  }
}
