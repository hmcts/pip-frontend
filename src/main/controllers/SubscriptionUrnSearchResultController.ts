import { Response } from 'express';
import {PipRequest} from '../models/request/PipRequest';
import {cloneDeep} from 'lodash';
import {SubscriptionService} from '../service/subscriptionService';

const subscriptionService = new SubscriptionService();
let searchInput;
export default class SubscriptionUrnSearchResultController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    searchInput = req.query['search-input'];

    if (searchInput && searchInput.length) {
      const searchResults = await subscriptionService.getSubscriptionUrnDetails(searchInput.toString());

      if (searchResults) {
        res.render('subscription-urn-search-results', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-urn-search-results']),
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
    res.redirect(`subscription-confirmation?search-input=${searchInput}&stype=urn`);
  }

}
