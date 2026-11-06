import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { UserCommService } from '../../service/UserCommService';

const userCommService = new UserCommService();

export default class SystemAdminDashboardController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const userComms = await userCommService.getUserComms();

        res.render('system-admin/system-admin-dashboard', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['system-admin-dashboard']),
            user: req.user,
            activeSystemAdminDashboard: true,
            userComms,
        });
    }
}
