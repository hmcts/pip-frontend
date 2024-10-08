import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { SubscriptionService } from '../service/SubscriptionService';
import { cloneDeep } from 'lodash';
import { PendingSubscriptionsFromCache } from '../service/PendingSubscriptionsFromCache';

const subscriptionService = new SubscriptionService();

export default class SubscriptionConfigureListConfirmedController {
    public async post(req: PipRequest, res: Response): Promise<void> {
        const userId = req.user['userId'];
        const cacheService = new PendingSubscriptionsFromCache();

        if (req.body['list-language'] === undefined) {
            res.redirect('/subscription-config-list-language?error=true');
            return;
        } else {
            await subscriptionService.handleNewSubscription(req.body, req.user);
        }

        const cachedListTypes = await cacheService.getPendingSubscriptions(userId, 'listTypes');

        let success;
        if (cachedListTypes?.length) {
            const listLanguage = req.body['list-language'].split(',').map(function (x) {
                return x.toUpperCase();
            });
            success = await subscriptionService.configureListTypeForLocationSubscriptions(
                req.user['userId'],
                cachedListTypes,
                listLanguage
            );
        } else {
            success = false;
        }

        if (success) {
            res.render('subscription-configure-list-confirmed', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-configure-list-confirmed']),
            });
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
