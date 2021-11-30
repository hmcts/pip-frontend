import { Response } from 'express';
import {PipRequest} from '../models/request/PipRequest';
import {SubscriptionService} from '../service/subscriptionService';

const subscriptionService = new SubscriptionService();

export default class SubscriptionConfirmedController {
  public async get(req: PipRequest, res: Response): Promise<void> {

    res.render('subscription-confirmed', req.i18n.getDataByLanguage(req.lng)['subscription-confirmed']);
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    await subscriptionService.subscribe(req.user);
    res.render('subscription-confirmed', req.i18n.getDataByLanguage(req.lng)['subscription-confirmed']);
  }

}
