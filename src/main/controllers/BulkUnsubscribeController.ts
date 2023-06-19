import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { SubscriptionService } from '../service/subscriptionService';

const bulkUnsubscribeUrl = 'bulk-unsubscribe';
const bulkUnsubscribeConfirmationUrl = 'bulk-unsubscribe-confirmation';
const subscriptionService = new SubscriptionService();

export default class BulkUnsubscribeController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        if (req.user) {
            const subscriptionData = await subscriptionService.getSubscriptionDataForView(
                req.user['userId'],
                req.lng as string,
                Object.keys(req.query)[0]
            );
            res.render(bulkUnsubscribeUrl, {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[bulkUnsubscribeUrl]),
                ...subscriptionData,
            });
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const subscriptionsToDelete = BulkUnsubscribeController.getSelectedSubscriptions(req.body);
        if (req.user) {
            if (subscriptionsToDelete.length == 0) {
                const subscriptionData = await subscriptionService.getSubscriptionDataForView(
                    req.user['userId'],
                    req.lng as string,
                    Object.keys(req.query)[0]
                );

                res.render(bulkUnsubscribeUrl, {
                    ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[bulkUnsubscribeUrl]),
                    ...subscriptionData,
                    noOptionSelectedError: true,
                });
            } else {
                res.render(bulkUnsubscribeConfirmationUrl, {
                    ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[bulkUnsubscribeConfirmationUrl]),
                    subscriptions: subscriptionsToDelete,
                });
            }
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }

    private static getSelectedSubscriptions(body): string[] {
        const { caseSubscription, courtSubscription } = body;
        const subscriptionsToDelete = [];
        if (caseSubscription !== undefined) {
            BulkUnsubscribeController.addToSubscriptionsForDeletion(caseSubscription, subscriptionsToDelete);
        }
        if (courtSubscription !== undefined) {
            BulkUnsubscribeController.addToSubscriptionsForDeletion(courtSubscription, subscriptionsToDelete);
        }
        return subscriptionsToDelete;
    }

    private static addToSubscriptionsForDeletion(subscription, subscriptionsToDelete): void {
        if (Array.isArray(subscription)) {
            subscriptionsToDelete.push(...subscription);
        } else {
            subscriptionsToDelete.push(subscription);
        }
    }
}
