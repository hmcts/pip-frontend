import { Response } from 'express';
import {PipRequest} from '../models/request/PipRequest';
import {cloneDeep} from 'lodash';
import {SubscriptionService} from '../service/subscriptionService';

const subscriptionService = new SubscriptionService();
let searchInput;
export default class SubscriptionConfirmationController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    searchInput = req.query['search-input'];
    const type = req.query['stype'];
    let searchResults;
    if (searchInput && searchInput.length) {
      switch (type) {
        case 'urn':
          searchResults = await subscriptionService.getSubscriptionUrnDetails(searchInput.toString());
          break;
      }

      if (searchResults) {
        res.render('subscription-confirmation', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-confirmation']),
          searchInput : searchInput,
          searchResults: searchResults,
        });
      } else {
        res.render('error', req.i18n.getDataByLanguage(req.lng).error);
      }
    }
    else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }

  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    res.redirect('subscription-confirmed');
  }

}
