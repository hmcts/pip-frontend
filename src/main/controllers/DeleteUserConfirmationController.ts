import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { AccountManagementRequests } from '../resources/requests/accountManagementRequests';
import { cloneDeep } from 'lodash';

const accountManagementRequests = new AccountManagementRequests();

export default class DeleteUserConfirmationController {
    public async post(req: PipRequest, res: Response): Promise<void> {
        if (req.body?.['delete-user-confirm'] === 'yes') {
            const deleteUserResponse = await accountManagementRequests.deleteUser(
                req.body.user as string,
                req.user['userId']
            );
            deleteUserResponse
                ? res.render('delete-user-confirmation', {
                      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['delete-user-confirmation']),
                      isSystemAdmin: req.user['roles'] === 'SYSTEM_ADMIN',
                  })
                : res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        } else {
            const hrefDeletion = ('/manage-user?id=' + req.body.user) as string;
            res.redirect(hrefDeletion);
        }
    }
}
