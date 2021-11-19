import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';

export default class UnsubscribeConfirmationController {
  public async post(req: PipRequest, res: Response): Promise<void> {
    console.log('req, body', req.body);
    // send request to page and based on that response render block
    if (req.body['unsubscribe-confirm']) {
      const unsubscribeBody = req.body['unsubscribe-confirm'];
      if (unsubscribeBody === 'yes') {
        res.render('unsubscribe-confirmation', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['unsubscribe-confirmation']),
        });
      }
      else {
        res.redirect('/subscription-management');
      }
    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
