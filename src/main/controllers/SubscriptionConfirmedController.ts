import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { SubscriptionService } from '../service/subscriptionService';

const subscriptionService = new SubscriptionService();

export default class SubscriptionConfirmedController {
  public async post(req: PipRequest, res: Response): Promise<void> {
    const subscribed = await subscriptionService.subscribe(req.user['id']);
    subscribed ?
      res.render('subscription-confirmed', req.i18n.getDataByLanguage(req.lng)['subscription-confirmed']) :
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
  }
}
