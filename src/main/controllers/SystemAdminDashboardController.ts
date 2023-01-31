import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';

export default class SystemAdminDashboardController {
    public get(req: PipRequest, res: Response): void {
        res.render('system-admin-dashboard', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['system-admin-dashboard']),
            user: req.user,
        });
    }
}
