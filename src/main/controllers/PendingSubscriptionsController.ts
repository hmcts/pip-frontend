import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { SubscriptionService } from '../service/SubscriptionService';
import { cloneDeep } from 'lodash';
import { pendingCaseSubscriptionSorter, pendingLocationSubscriptionSorter } from '../helpers/sortHelper';
import { PendingSubscriptionsFromCache } from '../service/PendingSubscriptionsFromCache';

const subscriptionService = new SubscriptionService();

export default class PendingSubscriptionsController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const pendingSubscriptions = {
            cases: await subscriptionService.getSortedPendingSubscriptions(
                req.user['userId'],
                'cases',
                pendingCaseSubscriptionSorter
            ),
            courts: await subscriptionService.getSortedPendingSubscriptions(
                req.user['userId'],
                'courts',
                pendingLocationSubscriptionSorter
            ),
        };

        req.query?.['no-subscriptions']
            ? res.render('pending-subscriptions', {
                  ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['pending-subscriptions']),
                  pendingSubscriptions,
                  displayError: true,
              })
            : res.render('pending-subscriptions', {
                  ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['pending-subscriptions']),
                  pendingSubscriptions,
                  displayError: false,
              });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const userId = req.user['userId'];
        const cacheService = new PendingSubscriptionsFromCache();
        const cachedCases = await cacheService.getPendingSubscriptions(userId, 'cases');

        if (cachedCases?.length) {
            const subscribed = await subscriptionService.subscribe(userId);
            subscribed
                ? res.redirect('/subscription-confirmed')
                : res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        } else {
            res.redirect('pending-subscriptions?no-subscriptions=true');
        }
    }

    public async removeSubscription(req: PipRequest, res: Response): Promise<void> {
        await subscriptionService.removeFromCache(req.query, req.user['userId']);
        const pendingSubscriptions = {
            cases: await subscriptionService.getSortedPendingSubscriptions(
                req.user['userId'],
                'cases',
                pendingCaseSubscriptionSorter
            ),
            courts: await subscriptionService.getSortedPendingSubscriptions(
                req.user['userId'],
                'courts',
                pendingLocationSubscriptionSorter
            ),
        };

        res.render('pending-subscriptions', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['pending-subscriptions']),
            pendingSubscriptions,
        });
    }
}
