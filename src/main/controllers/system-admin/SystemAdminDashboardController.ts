import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { UserCommunicationService } from '../../service/UserCommunicationService';

const userCommunicationService = new UserCommunicationService();

export default class SystemAdminDashboardController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const userCommunications = await userCommunicationService.groupCommunicationMessages();

        res.render('system-admin/system-admin-dashboard', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['system-admin-dashboard']),
            user: req.user,
            activeSystemAdminDashboard: true,
            userCommunications,
        });
    }
}
