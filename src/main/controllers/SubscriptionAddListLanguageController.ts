import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { SubscriptionService } from '../service/SubscriptionService';
import { PendingSubscriptionsFromCache } from '../service/PendingSubscriptionsFromCache';

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
            const userId = req.user['userId'];
            const cacheService = new PendingSubscriptionsFromCache();
            const cachedCourts = await cacheService.getPendingSubscriptions(userId, 'courts');
            const cachedCases = await cacheService.getPendingSubscriptions(userId, 'cases');
            const cachedListTypes = await cacheService.getPendingSubscriptions(userId, 'listTypes');
            const cachedListLanguages = await cacheService.getPendingSubscriptions(userId, 'listLanguage');

            if (
                cachedCases?.length ||
                (cachedCourts?.length && cachedListTypes?.length && cachedListLanguages?.length)
            ) {
                const subscribed = await subscriptionService.subscribe(userId);
                subscribed
                    ? res.redirect('/subscription-confirmed')
                    : res.render('error', req.i18n.getDataByLanguage(req.lng).error);
            } else {
                res.redirect('pending-subscriptions?no-subscriptions=true');
            }
        }
    }
}
