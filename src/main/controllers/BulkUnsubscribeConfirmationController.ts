import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { SubscriptionService } from '../service/subscriptionService';

const unsubscribeConfirmationUrl = 'bulk-unsubscribe-confirmation';
const unsubscribeConfirmedUrl = 'bulk-unsubscribe-confirmed';
const subscriptionService = new SubscriptionService();

export default class BulkUnsubscribeConfirmationController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        res.render(unsubscribeConfirmationUrl, req.i18n.getDataByLanguage(req.lng)[unsubscribeConfirmationUrl]);
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        if (req.body['bulk-unsubscribe-choice'] === 'yes') {
            const subscriptionsToDelete = req.body.subscriptions.split(',');
            const unsubscribeResponse = await subscriptionService.bulkDeleteSubscriptions(subscriptionsToDelete);
            unsubscribeResponse
                ? res.redirect(unsubscribeConfirmedUrl)
                : res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        } else if (req.body['bulk-unsubscribe-choice'] === 'no') {
            res.redirect('subscription-management');
        } else {
            res.render(unsubscribeConfirmationUrl, {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[unsubscribeConfirmationUrl]),
                noOptionSelectedError: true,
            });
        }
    }
}
