import { Request, Response } from 'express';
import {SubscriptionSearchActions} from '../resources/actions/subscriptionSearchActions';
import {isNull} from 'util';

const subscriptionCaseList = new SubscriptionSearchActions();

export default class SubscriptionSearchController {
  public get(req: Request, res: Response): void {
    res.render('subscription-case-search');
  }

  public post(req: Request, res: Response): void {
    const searchInput = req.body['search-input'];
    if (searchInput && searchInput.length >= 3) {
      (!isNull(subscriptionCaseList.getSubscriptionCaseDetails(searchInput)) &&
        subscriptionCaseList.getSubscriptionCaseDetails(searchInput).length > 0) ?
        res.redirect(`subscription-search-case-results?search-input=${searchInput}`) :
        res.render('subscription-case-search', { invalidInputError: false, noResultsError: true});
    } else {
      res.render('subscription-case-search', { invalidInputError: true, noResultsError: false });
    }
  }
}
