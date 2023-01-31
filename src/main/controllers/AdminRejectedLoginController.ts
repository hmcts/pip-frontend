import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';

export default class AdminRejectedLoginController {
    public get(req: PipRequest, res: Response): void {
        res.render('admin-rejected-login', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['admin-rejected-login']),
            frontendUrl: process.env.FRONTEND_URL,
        });
    }
}
