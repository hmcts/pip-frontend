import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';

import { AccountManagementRequests } from '../resources/requests/accountManagementRequests';
import { formattedRoles } from '../models/consts';
import { UserManagementService } from '../service/userManagementService';

const accountManagementRequests = new AccountManagementRequests();
const userManagementService = new UserManagementService();
export default class UpdateUserController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const userId = req.query.id as string;
        const userData = await accountManagementRequests.getUserByUserId(userId, req.user['userId']);
        const selectBoxData = userManagementService.buildUserUpdateSelectBox(userData.roles);
        await userManagementService.auditAction(
            req.user,
            'MANAGE_USER',
            'Update user page requested containing user: ' + userId
        );

        res.render('update-user', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['update-user']),
            selectBoxData,
            userId,
            email: userData.email,
            currentRole: formattedRoles[userData.roles],
            error: req.query.error === 'true',
        });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const updateUserResponse = await accountManagementRequests.updateUser(
            req.body.userId as string,
            req.body.updatedRole as string,
            req.user['userId']
        );

        if (updateUserResponse === null) {
            await userManagementService.auditAction(
                req.user,
                'UPDATE_USER',
                'User with id: ' + req.body.userId + ' failed to be updated to: ' + req.body.updatedRole
            );

            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        } else if (updateUserResponse === 'FORBIDDEN') {
            await userManagementService.auditAction(
                req.user,
                'UPDATE_USER',
                'User has attempted to update their own role to: ' + req.body.updatedRole
            );

            res.redirect('/update-user?id=' + req.body.userId + '&error=true');
        } else {
            await userManagementService.auditAction(
                req.user,
                'UPDATE_USER',
                'User with id: ' + req.body.userId + ' has been updated to a: ' + req.body.updatedRole
            );
            res.render('update-user-confirmation', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['update-user-confirmation']),
                updatedRole: formattedRoles[req.body.updatedRole],
                isSystemAdmin: req.user['roles'] === 'SYSTEM_ADMIN',
            });
        }
    }
}
