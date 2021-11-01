import { Response } from 'express';
import {SubscriptionCaseSearchRequests} from '../resources/requests/subscriptionCaseSearchRequests';
import {PipRequest} from '../models/request/PipRequest';
import {cloneDeep} from 'lodash';

const subscriptionCaseSearchResults = new SubscriptionCaseSearchRequests();

export default class SubscriptionCaseSearchResultController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const searchInput = req.query['search-input'] as string;
    const searchResults = await subscriptionCaseSearchResults.getSubscriptionCaseDetails(searchInput);

    if (searchResults) {
      res.render('subscription-search-case-results', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-search-case-results']),
        searchInput : searchInput,
        searchResults: searchResults,
      });
    } else {
      res.render('error', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['error']),
      });
    }
  }
}
