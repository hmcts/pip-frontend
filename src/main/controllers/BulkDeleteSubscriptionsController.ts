import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {cloneDeep} from 'lodash';
import {SubscriptionService} from '../service/subscriptionService';

const bulkDeleteSubscriptionsUrl = 'bulk-delete-subscriptions';
const bulkDeleteConformationUrl = 'bulk-delete-subscriptions-confirmation';
const subscriptionService = new SubscriptionService();

export default class BulkDeleteSubscriptionsController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    if (req.user) {
      const subscriptionData = await subscriptionService.getSubscriptionDataForView(req.user['userId'], req.lng as string,
        Object.keys(req.query)[0], true);
      res.render(bulkDeleteSubscriptionsUrl, {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[bulkDeleteSubscriptionsUrl]),
        ...subscriptionData,
      });
    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const subscriptionsToDelete = BulkDeleteSubscriptionsController.getSelectedSubscriptions(req.body);
    if (req.user) {
      if (subscriptionsToDelete.length == 0) {
        const subscriptionData = await subscriptionService.getSubscriptionDataForView(req.user['userId'], req.lng as string,
          Object.keys(req.query)[0], true);

        res.render(bulkDeleteSubscriptionsUrl, {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[bulkDeleteSubscriptionsUrl]),
          ...subscriptionData,
          noOptionSelectedError: true,
        });
      } else {
        res.render(bulkDeleteConformationUrl, {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[bulkDeleteConformationUrl]),
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
      BulkDeleteSubscriptionsController.addToSubscriptionsForDeletion(caseSubscription, subscriptionsToDelete);
    }
    if (courtSubscription !== undefined) {
      BulkDeleteSubscriptionsController.addToSubscriptionsForDeletion(courtSubscription, subscriptionsToDelete);
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
