import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { SubscriptionService } from '../service/SubscriptionService';

const subscriptionService = new SubscriptionService();

export default class SubscriptionAddListLanguageController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        if (req.query.error === 'true') {
            res.render('subscription-add-list-language', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-add-list-language']),
                noSelectionError: true,
            });
        } else {
            res.render('subscription-add-list-language', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-add-list-language']),
                noSelectionError: false,
            });
        }
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const result = await subscriptionService.createListTypeSubscriptionPayload(req.body['list-selections[]']);

        if (Object.values(result).length == 0) {
            res.redirect('/subscription-add-list?error=true');
        } else {
            await subscriptionService.handleNewSubscription(req.body, req.user);
            res.render('subscription-add-list-language', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-add-list-language']),
                noSelectionError: false,
            });
        }
    }
}
