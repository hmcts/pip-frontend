import { Request, Response } from 'express';
import {SubscriptionSearchActions} from '../resources/actions/subscriptionSearchActions';

const subscriptionCaseList = new SubscriptionSearchActions();

export default class SubscriptionSearchResultController {
  public get(req: Request, res: Response): void {
    const searchInput = req.query['search-input'];
    const searchResults = subscriptionCaseList.getSubscriptionCaseDetails(searchInput.toString());

    if (searchResults.length) {
      res.render('subscription-search-case-results', {searchInput, searchResults});
    } else {
      res.render('error');
    }
  }
}
