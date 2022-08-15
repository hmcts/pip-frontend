import { Response } from 'express';

import { PipRequest } from '../models/request/PipRequest';

export default class SubscriptionConfigureListController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    res.render('subscription-configure-list', req.i18n.getDataByLanguage(req.lng)['subscription-configure-list']);
  }
}
