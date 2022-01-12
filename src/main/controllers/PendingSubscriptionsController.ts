import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { SubscriptionService } from '../service/subscriptionService';
import { cloneDeep } from 'lodash';

const subscriptionService = new SubscriptionService();

export default class PendingSubscriptionsController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const pendingSubscriptions = {
      cases: await subscriptionService.getPendingSubscriptions(req.user['id'], 'cases'),
      courts: await subscriptionService.getPendingSubscriptions(req.user['id'], 'courts'),
    };
    res.render('pending-subscriptions', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['pending-subscriptions']),
      pendingSubscriptions,
    });
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    await subscriptionService.handleNewSubscription(req.body, req.user);
    const pendingSubscriptions = {
      cases: await subscriptionService.getPendingSubscriptions(req.user['id'], 'cases'),
      courts: await subscriptionService.getPendingSubscriptions(req.user['id'], 'courts'),
    };

    res.render('pending-subscriptions', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['pending-subscriptions']),
      pendingSubscriptions,
    });
  }

  public async removeSubscription(req: PipRequest, res: Response): Promise<void> {
    await subscriptionService.removeFromCache(req.query, req.user['id']);
    const pendingSubscriptions = {
      cases: await subscriptionService.getPendingSubscriptions(req.user['id'], 'cases'),
      courts: await subscriptionService.getPendingSubscriptions(req.user['id'], 'courts'),
    };

    res.render('pending-subscriptions', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['pending-subscriptions']),
      pendingSubscriptions,
    });
  }
}
