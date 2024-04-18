import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';

export default class AccountHomeController {
    public get(req: PipRequest, res: Response): void {
        res.render('account-home', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['account-home']),
            showVerifiedBanner: req.query.verified as string,
        });
    }
}
