import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {cloneDeep} from 'lodash';
import {SubscriptionService} from '../service/subscriptionService';

const deleteConfirmationUrl = 'bulk-delete-subscriptions-confirmation';
const deleteConfirmedUrl = 'bulk-delete-subscriptions-confirmed';
const subscriptionService = new SubscriptionService();

export default class BulkDeleteSubscriptionsConfirmationController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    res.render(deleteConfirmationUrl, req.i18n.getDataByLanguage(req.lng)[deleteConfirmationUrl]);
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    if (req.body['bulk-delete-choice'] === 'yes') {
      const subscriptionsToDelete = req.body.subscriptions.split(',');
      const unsubscribeResponse = await subscriptionService.bulkDeleteSubscriptions(subscriptionsToDelete);
      unsubscribeResponse
        ? res.redirect(deleteConfirmedUrl)
        : res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    } else if (req.body['bulk-delete-choice'] === 'no') {
      res.redirect('subscription-management');
    } else {
      res.render(deleteConfirmationUrl, {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[deleteConfirmationUrl]),
        noOptionSelectedError: true,
      });
    }
  }
}
