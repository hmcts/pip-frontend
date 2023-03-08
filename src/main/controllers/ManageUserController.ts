import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { AccountManagementRequests } from '../resources/requests/accountManagementRequests';
import { UserManagementService } from '../service/userManagementService';

const accountManagementRequests = new AccountManagementRequests();
const userManagementService = new UserManagementService();
export default class ManageUserController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const userData = await accountManagementRequests.getUserByUserId(req.query.id as string, req.user['userId']);
        if (req.user['roles'] === 'SYSTEM_ADMIN') {
            await userManagementService.auditAction(
                req.user,
                'MANAGE_USER',
                'Manage user page requested containing user: ' + req.query.id
            );
        }

        const formattedData = userManagementService.buildManageUserSummaryList(userData);
        const hrefDeletion = '/delete-user?id=' + userData['userId'];

        res.render('manage-user', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manage-user']),
            email: userData['email'],
            formattedData,
            hrefDeletion,
        });
    }
}
