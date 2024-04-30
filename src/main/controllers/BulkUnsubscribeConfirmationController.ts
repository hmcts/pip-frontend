import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { SubscriptionService } from '../service/SubscriptionService';

const unsubscribeConfirmationUrl = 'bulk-unsubscribe-confirmation';
const unsubscribeConfirmedUrl = 'bulk-unsubscribe-confirmed';
const subscriptionService = new SubscriptionService();

export default class BulkUnsubscribeConfirmationController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        res.render(unsubscribeConfirmationUrl, req.i18n.getDataByLanguage(req.lng)[unsubscribeConfirmationUrl]);
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const subscriptionsToDelete = req.body.subscriptions?.split(',') ?? [];
        if (req.body['bulk-unsubscribe-choice'] === 'yes') {
            const unsubscribeResponse = await subscriptionService.bulkDeleteSubscriptions(
                subscriptionsToDelete,
                req.user['userId']
            );
            unsubscribeResponse
                ? res.redirect(unsubscribeConfirmedUrl)
                : res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        } else if (req.body['bulk-unsubscribe-choice'] === 'no') {
            res.redirect('subscription-management');
        } else {
            const subscriptionData = await subscriptionService.getSelectedSubscriptionDataForView(
                req.user['userId'],
                req.lng,
                subscriptionsToDelete
            );
            res.render(unsubscribeConfirmationUrl, {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[unsubscribeConfirmationUrl]),
                ...subscriptionData,
                subscriptions: subscriptionsToDelete,
                noOptionSelectedError: true,
            });
        }
    }
}
