import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';

export default class AdminDashboardController {
    public get(req: PipRequest, res: Response): void {
        res.render('admin-dashboard', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['admin-dashboard']),
            user: req.user,
        });
    }
}
