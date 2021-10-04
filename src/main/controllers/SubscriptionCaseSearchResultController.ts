import { Request, Response } from 'express';
import {PipApi} from '../utils/PipApi';
import {SubscriptionCaseSearchActions} from '../resources/actions/subscriptionCaseSearchActions';

let _api: PipApi;

export default class SubscriptionCaseSearchResultController {

  constructor(private readonly api: PipApi) {
    _api = this.api;
  }

  public async get(req: Request, res: Response): Promise<void> {
    const searchInput = req.query['search-input'];
    const searchResults = await new SubscriptionCaseSearchActions(_api).getSubscriptionCaseDetails(searchInput);

    if (searchResults && searchResults.length) {
      res.render('subscription-search-case-results', {searchInput, searchResults});
    } else {
      res.render('error');
    }
  }
} 
