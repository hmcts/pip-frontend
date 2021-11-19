import { Response } from 'express';
import {PipRequest} from '../models/request/PipRequest';
import {SubscriptionService} from '../service/subscriptionService';
import check from './common/utils';

const subscriptionService = new SubscriptionService();
let searchInput;
export default class SubscriptionUrnSearchResultController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    searchInput = req.query['search-input'];

    if (searchInput && searchInput.length) {
      const searchResults = await subscriptionService.getSubscriptionUrnDetails(searchInput.toString());

      check(searchResults,'subscription-urn-search-results',req, res, searchInput);

    }
    else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    res.redirect(`subscription-confirmation?search-input=${searchInput}&stype=urn`);
  }

}
