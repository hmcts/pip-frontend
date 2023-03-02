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
            req.user['userId'],
            req.user['email'],
            'MANAGE_USER',
            'Update user page requested containing user: ' + userId
        );

        res.render('update-user', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['update-user']),
            selectBoxData,
            userId,
            email: userData.email,
            currentRole: formattedRoles[userData.roles],
            error: false,
        });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const updateUserResponse = await accountManagementRequests.updateUser(
            req.body.userId as string,
            req.body.updatedRole as string,
            req.user['userId']
        );

        await userManagementService.auditAction(
            req.user['userId'],
            req.user['email'],
            'UPDATE_USER',
            'User with id: ' + req.body.userId + ' has been updated to a: ' + req.body.updatedRole
        );

        if (updateUserResponse === null) {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        } else if (updateUserResponse === 'FORBIDDEN') {
            const userId = req.body.userId;
            const userData = await accountManagementRequests.getUserByUserId(userId, req.user['userId']);
            const selectBoxData = userManagementService.buildUserUpdateSelectBox(userData.roles);
            await userManagementService.auditAction(
                req.user['userId'],
                req.user['email'],
                'MANAGE_USER',
                'Update user page requested containing user: ' + userId
            );

            res.render('update-user', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['update-user']),
                selectBoxData,
                userId,
                email: userData.email,
                currentRole: formattedRoles[userData.roles],
                error: true,
            });
        } else {
            res.render('update-user-confirmation', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['update-user-confirmation']),
                updatedRole: formattedRoles[req.body.updatedRole],
                isSystemAdmin: req.user['roles'] === 'SYSTEM_ADMIN',
            });
        }
    }
}
