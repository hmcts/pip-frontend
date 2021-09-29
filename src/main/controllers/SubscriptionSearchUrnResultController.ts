import { Request, Response } from 'express';
import {PipApi} from '../utils/PipApi';
import {SubscriptionSearchActions} from '../resources/actions/subscriptionSearchActions';


let _api: PipApi;
export default class SubscriptionSearchUrnResultController {

  constructor(private readonly api: PipApi) {
    _api = this.api;
  }

  public async get(req: Request, res: Response): Promise<void> {
    const searchInput = req.query['search-input'];

    const searchResults = await new SubscriptionSearchActions(_api).getSubscriptionUrnDetails(searchInput);


    if (searchResults && searchResults.length) {
      res.render('subscription-search-urn-results', {searchInput, searchResults});
    } else {
      res.render('error');
    }
  }

}
