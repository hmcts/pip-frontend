import { Response } from 'express';
import { HearingService } from '../service/hearingService';
import {cloneDeep} from 'lodash';
import {PipRequest} from '../models/request/PipRequest';

const hearingService = new HearingService();

export default class CaseReferenceNumberSearchController {

  public get(req: PipRequest, res: Response):  void {
    res.render('case-reference-number-search',
      req.i18n.getDataByLanguage(req.lng)['case-reference-number-search']);
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const searchInput = req.body['search-input'] as string;
    if (searchInput) {
      const searchResults = await hearingService.getHearingByCaseReferenceNumber(searchInput);

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
