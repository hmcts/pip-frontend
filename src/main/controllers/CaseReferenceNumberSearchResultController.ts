import { Response } from 'express';
import {HearingRequests} from '../resources/requests/hearingRequests';
import {PipRequest} from '../models/request/PipRequest';
import {cloneDeep} from 'lodash';

const hearingRequests = new HearingRequests();

export default class CaseReferenceNumberSearchResultController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const searchInput = req.query['search-input'] as string;
    const searchResults = await hearingRequests.getHearingByCaseReferenceNumber(searchInput);

    if (searchResults) {
      res.render('case-reference-number-search-results', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['case-reference-number-search-results']),
        searchInput,
        searchResults,
      });
    } else {
      res.render('error', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng).error),
      });
    }
  }
}
