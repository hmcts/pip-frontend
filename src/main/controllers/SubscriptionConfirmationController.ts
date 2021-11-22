import { Response } from 'express';
import {PipRequest} from '../models/request/PipRequest';
import {SubscriptionService} from '../service/subscriptionService';
import validateRendering from '../common/utils';

const subscriptionService = new SubscriptionService();
let searchInput;
export default class SubscriptionConfirmationController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    searchInput = req.query['search-input'];
    const type = req.query['stype'];
    let searchResults;
    if (searchInput && searchInput.length && type) {
      switch (type) {
        case 'urn':
          searchResults = await subscriptionService.getSubscriptionUrnDetails(searchInput.toString());
          break;
      }

      validateRendering(searchResults,'subscription-confirmation',req, res, searchInput);

    }
    else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }

  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    res.redirect('subscription-confirmed');
  }

}
