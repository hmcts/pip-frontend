import { Response } from 'express';
import {HearingRequests} from '../resources/requests/hearingRequests';
import {PipRequest} from '../models/request/PipRequest';
import {cloneDeep} from 'lodash';

const hearingRequests = new HearingRequests();

export default class SubscriptionCaseSearchResultController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const searchInput = req.query['search-input'] as string;
    const searchResults = await hearingRequests.getHearingByCaseReferenceNumber(searchInput);

    if (searchResults) {
      res.render('subscription-search-case-results', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-search-case-results']),
        searchInput,
        searchResults,
      });
    } else {
      res.render('error', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['error']),
      });
    }
  }
}
