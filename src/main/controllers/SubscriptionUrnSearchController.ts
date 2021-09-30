import { Request, Response } from 'express';
import {SubscriptionSearchActions} from '../resources/actions/subscriptionSearchActions';
import {PipApi} from '../utils/PipApi';

let _api: PipApi;
export default class SubscriptionUrnSearchController {

  constructor(private readonly api: PipApi) {
    _api = this.api;
  }

  public get(req: Request, res: Response): void {
    res.render('subscription-urn-search');
  }


  public async post(req: Request, res: Response): Promise<void> {
    const searchInput = req.body['search-input'];

    if (searchInput && searchInput.length >= 3) {
      const searchResults = await new SubscriptionSearchActions(_api).getSubscriptionUrnDetails(searchInput);
      (searchResults && searchResults.length > 0) ?
        res.redirect(`subscription-urn-search-results?search-input=${searchInput}`) :
        res.render('subscription-urn-search', {invalidInputError: false, noResultsError: true});
    } else {
      res.render('subscription-urn-search', {invalidInputError: true, noResultsError: false});
    }
  }

}
