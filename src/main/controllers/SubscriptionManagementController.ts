import { Response } from 'express';
import {PipRequest} from '../models/request/PipRequest';

export default class SubscriptionManagementController {
  public get(req: PipRequest, res: Response): void {
    res.render('subscription-management', req.i18n.getDataByLanguage(req.lng)['subscription-management']);
  }
}
