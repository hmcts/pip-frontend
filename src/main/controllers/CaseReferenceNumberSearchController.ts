import { Response } from 'express';
import {HearingRequests} from '../resources/requests/hearingRequests';
import {cloneDeep} from 'lodash';
import {PipRequest} from '../models/request/PipRequest';

const hearingRequests = new HearingRequests();

export default class CaseReferenceNumberSearchController {

  public get(req: PipRequest, res: Response):  void {
    res.render('case-reference-number-search', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['case-reference-number-search']),
    });
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const searchInput = req.body['search-input'] as string;
    if (searchInput) {
      const searchResults = await hearingRequests.getHearingByCaseReferenceNumber(searchInput);

      (searchResults) ?
        res.redirect(`case-reference-number-search-results?search-input=${searchInput}`) :
        res.render('case-reference-number-search', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['case-reference-number-search']),
          invalidInputError: false,
          noResultsError: true,
        });
    } else {
      res.render('case-reference-number-search', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['case-reference-number-search']),
        invalidInputError: true,
        noResultsError: false,
      });
    }
  }
}
