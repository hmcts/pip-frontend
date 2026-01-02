import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { UserManagementService } from '../../service/UserManagementService';
import { CourtelThirdPartyService } from '../../service/CourtelThirdPartyService';

const courtelThirdPartyService = new CourtelThirdPartyService();
const userManagementService = new UserManagementService();

export default class ManageThirdPartyUsersController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        await userManagementService.auditAction(
            req.user,
            'VIEW_THIRD_PARTY_USERS',
            'User requested to view all third party users'
        );

        res.render('system-admin/manage-third-party-users', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manage-third-party-users']),
            thirdPartyAccounts: await courtelThirdPartyService.getThirdPartyAccounts(req.user['userId']),
        });
    }
}
