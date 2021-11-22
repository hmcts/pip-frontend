import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { SubscriptionRequests } from '../resources/requests/subscriptionRequests';

const subscriptionRequests = new SubscriptionRequests();

export default class UnsubscribeConfirmationController {
  public async post(req: PipRequest, res: Response): Promise<void> {
    // send request to page and based on that response render block
    if (req.body?.['unsubscribe-confirm'] === 'yes') {
      const unsubscribeResponse = await subscriptionRequests.unsubscribe({...req.body, userId: req.user['id']});
      unsubscribeResponse ?
        res.render('unsubscribe-confirmation', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['unsubscribe-confirmation']),
        }) :
        res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    } else {
      res.redirect('/subscription-management');
    }
  }
}
