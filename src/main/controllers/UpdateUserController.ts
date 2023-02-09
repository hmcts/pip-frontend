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
        });
    }
}
