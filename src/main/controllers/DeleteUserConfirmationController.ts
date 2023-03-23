import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { AccountManagementRequests } from '../resources/requests/accountManagementRequests';
import { cloneDeep } from 'lodash';
import { UserManagementService } from '../service/userManagementService';

const accountManagementRequests = new AccountManagementRequests();
const userManagementService = new UserManagementService();

export default class DeleteUserConfirmationController {
    public async post(req: PipRequest, res: Response): Promise<void> {
        if (req.body?.['delete-user-confirm'] === 'yes') {
            const deleteUserResponse = await accountManagementRequests.deleteUser(
                req.body.user as string,
                req.user['userId']
            );
            await userManagementService.auditAction(
                req.user,
                'DELETE_USER',
                'User has been deleted, id: ' + req.body.user
            );
            deleteUserResponse
                ? res.render('delete-user-confirmation', {
                      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['delete-user-confirmation']),
                      isSystemAdmin: req.user['roles'] === 'SYSTEM_ADMIN',
                  })
                : res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        } else {
            const hrefDeletion = '/manage-user?id=' + req.body.user;
            res.redirect(hrefDeletion);
        }
    }
}
