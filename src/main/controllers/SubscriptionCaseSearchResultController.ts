import { Response } from 'express';
import {HearingRequests} from '../resources/requests/hearingRequests';
import {PipRequest} from '../models/request/PipRequest';
import {cloneDeep} from 'lodash';

const hearingRequests = new HearingRequests();

export default class SubscriptionCaseSearchResultController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const searchInput = req.query['search-input'] as string;
    const searchResults = await hearingRequests.getSubscriptionCaseDetails(searchInput);

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

  public async post(req: PipRequest, res: Response): Promise<void> {
    const caseNumber = req.body['case-number'] as string;
    const caseName = req.body['case-name'] as string;

    res.redirect(`pending-subscriptions?case-number=${caseNumber}&case-name=${caseName}`);
  }
}
