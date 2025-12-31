import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { ThirdPartyService } from '../../service/ThirdPartyService';
import { UserManagementService } from '../../service/UserManagementService';

const thirdPartyService = new ThirdPartyService();
const userManagementService = new UserManagementService();

export default class ManageThirdPartySubscribersViewController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        if (req.query['userId']) {
            const user = await thirdPartyService.getThirdPartySubscriberById(req.query['userId'], req.user['userId']);
            if (user) {
                await userManagementService.auditAction(
                    req.user,
                    'MANAGE_THIRD_PARTY_SUBSCRIBER_VIEW',
                    'User requested to view third party subscriber with id: ' + user.userId
                );

                res.render('system-admin/manage-third-party-subscribers-view', {
                    ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manage-third-party-subscribers-view']),
                    userDetails: user,
                });

                return;
            }
        }

        res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
}
