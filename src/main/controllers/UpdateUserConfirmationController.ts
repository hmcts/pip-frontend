import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import {AccountManagementRequests} from '../resources/requests/accountManagementRequests';
import {cloneDeep} from 'lodash';
import {formattedRoles} from '../models/consts';
import {UserManagementService} from '../service/userManagementService';

const accountManagementRequests = new AccountManagementRequests();
const userManagementService = new UserManagementService();

export default class UpdateUserConfirmationController {
  public async post(req: PipRequest, res: Response): Promise<void> {
    const updateUserResponse = await accountManagementRequests.updateUser(req.body.userId as string,
      req.body.updatedRole as string, req.user['userId']);
    await userManagementService.auditAction(req.user['userId'], req.user['email'], 'UPDATE_USER',
      'User with id: ' + req.body.userId + ' has been updated to a: ' + req.body.updatedRole);
    updateUserResponse ? res.render('update-user-confirmation', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['update-user-confirmation']),
      updatedRole: formattedRoles[req.body.updatedRole],
      isSystemAdmin: req.user['roles'] === 'SYSTEM_ADMIN',
    }) : res.render('error', req.i18n.getDataByLanguage(req.lng).error);
  }
}
