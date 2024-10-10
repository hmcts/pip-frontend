import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { SubscriptionService } from '../service/SubscriptionService';
import {PendingSubscriptionsFromCache} from "../service/PendingSubscriptionsFromCache";

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
            const userId = req.user['userId'];
            const cacheService = new PendingSubscriptionsFromCache();

            await subscriptionService.handleNewSubscription(req.body, req.user);

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

            success
                ? res.redirect('/subscription-configure-list-confirmed')
                : res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
