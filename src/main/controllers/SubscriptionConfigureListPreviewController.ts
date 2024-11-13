import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { SubscriptionService } from '../service/SubscriptionService';
import { cloneDeep } from 'lodash';
import { PendingSubscriptionsFromCache } from '../service/PendingSubscriptionsFromCache';

const subscriptionService = new SubscriptionService();
const cacheService = new PendingSubscriptionsFromCache();

export default class SubscriptionConfigureListPreviewController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const pendingSubscriptions = await subscriptionService.getAllUserSubscriptionsFromCache(
            req.user['userId'],
            req.lng
        );

        req.query?.['no-list-configure']
            ? res.render('subscription-configure-list-preview', {
                  ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-configure-list-preview']),
                  pendingSubscriptions,
                  displayError: true,
              })
            : res.render('subscription-configure-list-preview', {
                  ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-configure-list-preview']),
                  pendingSubscriptions,
                  displayError: false,
              });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const userId = req.user['userId'];

        const cachedListTypes = await cacheService.getPendingSubscriptions(userId, 'listTypes');

        if (cachedListTypes?.length === 0) {
            res.redirect('subscription-configure-list-preview?no-list-configure=true');
        } else {
            const userId = req.user['userId'];
            await subscriptionService.handleNewSubscription(req.body, req.user);
            const cachedListTypes = await cacheService.getPendingSubscriptions(userId, 'listTypes');
            const cachedListLanguage = await cacheService.getPendingSubscriptions(userId, 'listLanguage');

            let success;
            if (cachedListTypes?.length) {
                success = await subscriptionService.configureListTypeForLocationSubscriptions(
                    req.user['userId'],
                    cachedListTypes,
                    cachedListLanguage
                );
            } else {
                success = false;
            }

            success
                ? res.redirect('/subscription-configure-list-confirmed')
                : res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }

    public async removeConfigureList(req: PipRequest, res: Response): Promise<void> {
        await subscriptionService.removeFromCache(req.query, req.user['userId']);

        const cachedListTypes = await cacheService.getPendingSubscriptions(req.user['userId'], 'listTypes');
        if (cachedListTypes?.length === 0) {
            res.redirect('subscription-configure-list-preview?no-list-configure=true');
        } else {
            const pendingSubscriptions = await subscriptionService.getAllUserSubscriptionsFromCache(
                req.user['userId'],
                req.lng
            );

            res.render('subscription-configure-list-preview', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-configure-list-preview']),
                pendingSubscriptions,
            });
        }
    }
}
