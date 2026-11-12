import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { UserCommunicationService } from '../service/UserCommunicationService';

const userCommunicationService = new UserCommunicationService();

export default class AccountHomeController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const userCommunications = await userCommunicationService.groupCommunicationMessages();

        res.render('account-home', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['account-home']),
            showVerifiedBanner: req.query.verified as string,
            activeVerifiedDashboard: true,
            user: req.user,
            userCommunications,
        });
    }
}
