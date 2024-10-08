import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { SubscriptionService } from '../service/SubscriptionService';

const subscriptionsService = new SubscriptionService();

export default class SubscriptionConfigListLanguageController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const listTypeLanguageSubscriptions = await subscriptionsService.getUserSubscriptionListLanguage(
            req.user['userId']
        );
        if (req.query.error === 'true') {
            res.render('subscription-config-list-language', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-config-list-language']),
                listTypeLanguageSubscriptions,
                noSelectionError: true,
            });
        } else {
            res.render('subscription-config-list-language', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-config-list-language']),
                listTypeLanguageSubscriptions,
                noSelectionError: false,
            });
        }
    }
}
