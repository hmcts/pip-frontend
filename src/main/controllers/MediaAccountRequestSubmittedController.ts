import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import {clone} from 'lodash';

export default class MediaAccountRequestSubmittedController {
  public get(req: PipRequest, res: Response): void {
    const reference = req.query['reference'] as string;
    res.render('account-request-submitted', {
      ...clone(req.i18n.getDataByLanguage(req.lng)['account-request-submitted']),
      reference,
    });
  }
}
