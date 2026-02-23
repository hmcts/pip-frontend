import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { ThirdPartyService } from '../../service/ThirdPartyService';
import { UserManagementService } from '../../service/UserManagementService';

const thirdPartyService = new ThirdPartyService();
const userManagementService = new UserManagementService();

export default class ManageThirdPartySubscriberStatusController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        await userManagementService.auditAction(
            req.user,
            'VIEW_THIRD_PARTY_SUBSCRIBERS_STATUS',
            'User requested to view third party subscribers status'
        );
        const user = await thirdPartyService.getThirdPartySubscriberById(req.query['userId'], req.user['userId']);
        if (user) {
            res.render('system-admin/manage-third-party-subscriber-status', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manage-third-party-subscriber-status']),
                userDetails: user,
                statusOptions: ['Pending', 'Active', 'Suspended'],
            });
            return;
        }
        res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const { userId, status } = req.body;
        const result = await thirdPartyService.updateThirdPartySubscriberStatus(userId, status, req.user['userId']);
        if (result) {
            res.redirect('/manage-third-party-subscriber-status-success');
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
