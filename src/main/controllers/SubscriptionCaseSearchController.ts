import { Request, Response } from 'express';
import {SubscriptionCaseSearchActions} from '../resources/actions/subscriptionCaseSearchActions';
import {isNull} from 'util';
import {PipApi} from '../utils/PipApi';

let _api: PipApi;

export default class SubscriptionCaseSearchController {

  constructor(private readonly api: PipApi) {
    _api = this.api;
  }

  public get(req: Request, res: Response): void {
    res.render('subscription-case-search');
  }

  public async post(req: Request, res: Response): Promise<void> {
    const searchInput = req.body['search-input'];
    if (searchInput && searchInput.length >= 3) {
      const searchResults = await new SubscriptionCaseSearchActions(_api).getSubscriptionCaseDetails(searchInput);

      (!isNull(searchResults) && searchResults.length > 0) ?
        res.redirect(`subscription-search-case-results?search-input=${searchInput}`) :
        res.render('subscription-case-search', { invalidInputError: false, noResultsError: true});
    } else {
      res.render('subscription-case-search', { invalidInputError: true, noResultsError: false });
    }
  }
}
