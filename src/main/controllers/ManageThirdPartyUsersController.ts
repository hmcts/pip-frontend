import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { ThirdPartyService } from '../service/thirdPartyService';
import { UserManagementService } from '../service/userManagementService';

const thirdPartyService = new ThirdPartyService();
const userManagementService = new UserManagementService();

export default class ManageThirdPartyUsersController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        await userManagementService.auditAction(
            req.user,
            'VIEW_THIRD_PARTY_USERS',
            'User requested to view all third party users'
        );

        res.render('manage-third-party-users', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manage-third-party-users']),
            thirdPartyAccounts: await thirdPartyService.getThirdPartyAccounts(req.user['userId']),
        });
    }
}
