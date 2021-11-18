import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';

export default class UnsubscribeConfirmationController {
  public post(req: PipRequest, res: Response): void {
    console.log('req', req.body);
    res.render('unsubscribe-confirmation', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['unsubscribe-confirmation']),
    });
  }
}
