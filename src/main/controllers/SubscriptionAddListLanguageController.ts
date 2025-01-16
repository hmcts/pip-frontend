import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { SubscriptionService } from '../service/SubscriptionService';

const subscriptionService = new SubscriptionService();

export default class SubscriptionAddListLanguageController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        res.render('subscription-add-list-language', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-add-list-language']),
        });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        if (req.body['list-language'] === undefined) {
            res.render('subscription-add-list-language', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-add-list-language']),
                noSelectionError: true,
            });
        } else {
            await subscriptionService.handleNewSubscription(req.body, req.user);
            res.redirect('/subscription-confirmation-preview');
        }
    }
}
