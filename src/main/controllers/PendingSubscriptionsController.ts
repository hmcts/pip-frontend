import { Response } from 'express';
import {PipRequest} from '../models/request/PipRequest';
import {SubscriptionService} from '../service/subscriptionService';
import validateRendering from '../common/utils';

const subscriptionService = new SubscriptionService();
export default class PendingSubscriptionsController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const searchResults = await subscriptionService.getPendingSubscriptions(req.user);
    validateRendering(searchResults,'pending-subscriptions',req, res, null);
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const searchResults = await subscriptionService.getPendingSubscriptions(req.user);
    await subscriptionService.subscribe(searchResults, req.user);
    res.render('subscription-confirmed', req.i18n.getDataByLanguage(req.lng)['subscription-confirmed']);
  }

  public async removeCase(req: PipRequest, res: Response): Promise<void> {
    const id = req.query['id'] as string;
    await subscriptionService.removeFromCache(parseInt(id), req.user);
    const searchResults = await subscriptionService.getPendingSubscriptions(req.user);
    validateRendering(searchResults,'pending-subscriptions',req, res, null);
  }
}
