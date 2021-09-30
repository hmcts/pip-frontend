import { Request, Response } from 'express';
import {SubscriptionCaseSearchActions} from '../resources/actions/subscriptionCaseSearchActions';

const subscriptionCaseList = new SubscriptionCaseSearchActions();

export default class SubscriptionCaseSearchResultController {
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
