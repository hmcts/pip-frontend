import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { SubscriptionService } from '../service/SubscriptionService';

const subscriptionService = new SubscriptionService();

export default class SubscriptionConfigureListLanguageController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const listTypeLanguageSubscriptions = await subscriptionService.getUserSubscriptionListLanguage(
            req.user['userId']
        );

        res.render('subscription-configure-list-language', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-configure-list-language']),
            listTypeLanguageSubscriptions,
            noSelectionError: false,
        });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const listTypeLanguageSubscriptions = await subscriptionService.getUserSubscriptionListLanguage(
            req.user['userId']
        );
        if (req.body['list-language'] === undefined) {
            res.render('subscription-configure-list-language', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-configure-list-language']),
                listTypeLanguageSubscriptions,
                noSelectionError: true,
            });
        } else {
            await subscriptionService.handleNewSubscription(req.body, req.user);
            res.redirect('/subscription-configure-list-preview');
        }
    }
}
