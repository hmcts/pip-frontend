import { Response } from 'express';
import { PipRequest } from '../../models/request/PipRequest';
import { SubscriptionService } from '../../service/subscriptionService';
import { cloneDeep } from 'lodash';
import { pendingCaseSubscriptionSorter, pendingLocationSubscriptionSorter } from '../../helpers/sortHelper';

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
        await subscriptionService.handleNewSubscription(req.body, req.user);
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
