import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { UserCommService } from '../service/UserCommService';

const userCommService = new UserCommService();

export default class AccountHomeController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const userComms = await userCommService.getUserComms();

        res.render('account-home', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['account-home']),
            showVerifiedBanner: req.query.verified as string,
            activeVerifiedDashboard: true,
            user: req.user,
            userComms,
        });
    }
}
