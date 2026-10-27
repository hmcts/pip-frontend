import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { AccountManagementRequests } from '../../resources/requests/AccountManagementRequests';
import { cloneDeep } from 'lodash';
import { UserManagementService } from '../../service/UserManagementService';
import * as url from 'url';

const accountManagementRequests = new AccountManagementRequests();
const userManagementService = new UserManagementService();

export default class DeleteUserConfirmationController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const userId = req.query.id as string;
        const userData = await accountManagementRequests.getUserByUserId(userId, req.user['userId']);
        res.render('system-admin/delete-user-confirmation', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['delete-user-confirmation']),
            userData,
        });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        if (req.query?.id) {
            const userId = req.query.id as string;
            if (req.body['delete-user-confirm'] === 'yes') {
                const deleteUserResponse = await accountManagementRequests.deleteUser(
                    userId,
                    req.user['userId']
                );
                await userManagementService.auditAction(
                    req.user,
                    'DELETE_USER',
                    'User has been deleted, id: ' + req.body.user
                );
                deleteUserResponse
                    ? res.redirect('/delete-user-success')
                    : res.render('error', req.i18n.getDataByLanguage(req.lng).error);
            } else if (req.body['delete-user-confirm'] === 'no') {
                res.redirect(
                    url.format({
                        pathname: '/manage-user',
                        query: { id: userId },
                    })
                );
            } else {
                const userData = await accountManagementRequests.getUserByUserId(userId, req.user['userId']);
                res.render('system-admin/delete-user-confirmation', {
                    ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['delete-user-confirmation']),
                    userData,
                    noOptionError: true,
                });
            }
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
