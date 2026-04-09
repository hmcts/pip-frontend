import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { ThirdPartyService } from '../../service/ThirdPartyService';
import { UserManagementService } from '../../service/UserManagementService';

const thirdPartyService = new ThirdPartyService();
const userManagementService = new UserManagementService();

export default class ManageThirdPartyUsersController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        await userManagementService.auditAction(
            req.user,
            'VIEW_THIRD_PARTY_SUBSCRIBERS',
            'User requested to view all third-party subscribers'
        );

        res.render('system-admin/manage-third-party-subscribers', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manage-third-party-subscribers']),
            thirdPartySubscribers: await thirdPartyService.getThirdPartySubscribers(req.user['userId']),
        });
    }
}
