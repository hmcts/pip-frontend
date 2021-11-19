import { Response } from 'express';
import {PipRequest} from '../models/request/PipRequest';
import {cloneDeep} from 'lodash';

export default class SubscriptionConfirmedController {

  public async get(req: PipRequest, res: Response): Promise<void> {

    res.render('subscription-confirmed', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-confirmed']),
    });
  }

}
