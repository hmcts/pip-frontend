import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { SubscriptionService } from '../service/SubscriptionService';
import { cloneDeep } from 'lodash';
import { PendingSubscriptionsFromCache } from '../service/PendingSubscriptionsFromCache';

const subscriptionService = new SubscriptionService();

export default class SubscriptionConfirmationPreviewController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const pendingSubscriptions = await subscriptionService.getAllUserSubscriptionsFromCache(
            req.user['userId'],
            req.lng
        );

        req.query?.['error']
            ? res.render('subscription-confirmation-preview', {
                  ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-confirmation-preview']),
                  pendingSubscriptions,
                  displayError: true,
              })
            : res.render('subscription-confirmation-preview', {
                  ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-confirmation-preview']),
                  pendingSubscriptions,
                  displayError: false,
              });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const userId = req.user['userId'];

        const cacheService = new PendingSubscriptionsFromCache();
        const cachedCourts = await cacheService.getPendingSubscriptions(userId, 'courts');
        const cachedCases = await cacheService.getPendingSubscriptions(userId, 'cases');
        const cachedListTypes = await cacheService.getPendingSubscriptions(userId, 'listTypes');

        if (
            (cachedCases?.length === 0 && cachedCourts?.length === 0) ||
            (cachedCourts?.length > 0 && cachedListTypes?.length === 0)
        ) {
            res.redirect('subscription-confirmation-preview?error=true');
        } else {
            if (cachedCourts?.length === 0) {
                cacheService.removeLocationSubscriptionCache(userId);
            }

            const subscribed = await subscriptionService.subscribe(userId);
            subscribed
                ? res.redirect('/subscription-confirmed')
                : res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }

    public async removePendingSubscription(req: PipRequest, res: Response): Promise<void> {
        const userId = req.user['userId'];
        await subscriptionService.removeFromCache(req.query, userId);
        //If user removes the court, we need to remove relevant list types from the cache as well.
        if (req.query.court) {
            await subscriptionService.removeListTypeForCourt(req.user['userProvenance'], userId);
        }

        const cacheService = new PendingSubscriptionsFromCache();
        const cachedCases = await cacheService.getPendingSubscriptions(userId, 'cases');
        const cachedCourts = await cacheService.getPendingSubscriptions(userId, 'courts');
        const cachedListTypes = await cacheService.getPendingSubscriptions(userId, 'listTypes');

        if (cachedCases?.length > 0 || (cachedCourts?.length > 0 && cachedListTypes?.length > 0)) {
            const pendingSubscriptions = await subscriptionService.getAllUserSubscriptionsFromCache(userId, req.lng);

            res.render('subscription-confirmation-preview', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-confirmation-preview']),
                pendingSubscriptions,
                displayError: false,
            });
        } else {
            res.redirect('subscription-confirmation-preview?error=true');
        }
    }
}
