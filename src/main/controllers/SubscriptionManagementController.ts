import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { SubscriptionService } from '../service/subscriptionService';
import { cloneDeep } from 'lodash';

const subscriptionService = new SubscriptionService();

export default class SubscriptionManagementController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        if (!req.user) {
            return res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }

        const subscriptionData = await subscriptionService.getSubscriptionDataForView(
            req.user['userId'],
            req.lng,
            Object.keys(req.query)[0]
        );

        if (subscriptionService.containsNullValues(subscriptionData)) {
            return res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }

        return res.render('subscription-management', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-management']),
            ...subscriptionData,
        });
    }
}
