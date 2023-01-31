import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { SubscriptionService } from '../service/subscriptionService';
import { cloneDeep } from 'lodash';

const subscriptionService = new SubscriptionService();

export default class SubscriptionConfigureListConfirmedController {
    public async post(req: PipRequest, res: Response): Promise<void> {
        const result = await subscriptionService.configureListTypeForLocationSubscriptions(
            req.user['userId'],
            req.body['list-selections[]']
        );

        if (result) {
            res.render('subscription-configure-list-confirmed', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-configure-list-confirmed']),
            });
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
