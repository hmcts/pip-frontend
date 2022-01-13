import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { SubscriptionService } from '../service/subscriptionService';
import { PendingSubscriptionsFromCache } from '../resources/requests/utils/pendingSubscriptionsFromCache';

const subscriptionService = new SubscriptionService();
const cacheService = new PendingSubscriptionsFromCache();

export default class SubscriptionConfirmedController {
  public async post(req: PipRequest, res: Response): Promise<void> {
    const userId = req.user['id'];
    const cachedCourts = await cacheService.getPendingSubscriptions(userId, 'courts');
    const cachedCases = await cacheService.getPendingSubscriptions(userId, 'cases');

    if (cachedCases?.length || cachedCourts?.length) {
      const subscribed = await subscriptionService.subscribe(userId);
      subscribed ?
        res.render('subscription-confirmed', req.i18n.getDataByLanguage(req.lng)['subscription-confirmed']) :
        res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    } else {
      res.redirect('pending-subscriptions?no-subscriptions=true');
    }
  }
}
