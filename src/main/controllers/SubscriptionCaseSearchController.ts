import { Response } from 'express';
import {HearingRequests} from '../resources/requests/hearingRequests';
import {cloneDeep} from 'lodash';
import {PipRequest} from '../models/request/PipRequest';

const hearingRequests = new HearingRequests();

export default class SubscriptionCaseSearchController {

  public async get(req: PipRequest, res: Response):  Promise<void> {
    res.render('subscription-case-search', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-case-search']),
    });
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const searchInput = req.body['search-input'] as string;
    if (searchInput) {
      const searchResults = await hearingRequests.getSubscriptionCaseDetails(searchInput);

      (searchResults) ?
        res.redirect(`subscription-search-case-results?search-input=${searchInput}`) :
        res.render('subscription-case-search', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-case-search']),
          invalidInputError: false,
          noResultsError: true,
        });
    } else {
      res.render('subscription-case-search', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-case-search']),
        invalidInputError: true,
        noResultsError: false,
      });
    }
  }
}
