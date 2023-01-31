import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { SubscriptionService } from '../service/subscriptionService';

const subscriptionService = new SubscriptionService();

export default class UnsubscribeConfirmationController {
    public async post(req: PipRequest, res: Response): Promise<void> {
        if (req.body?.['unsubscribe-confirm'] === 'yes') {
            const unsubscribeResponse = await subscriptionService.unsubscribe(
                req.body.subscription,
                req.user['userId']
            );
            unsubscribeResponse
                ? res.render(
                      'unsubscribe-confirmation',
                      req.i18n.getDataByLanguage(req.lng)['unsubscribe-confirmation']
                  )
                : res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        } else {
            res.redirect('/subscription-management');
        }
    }
}
