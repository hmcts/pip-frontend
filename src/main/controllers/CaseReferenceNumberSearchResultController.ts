import { Response } from 'express';
import { HearingService } from '../service/hearingService';
import {PipRequest} from '../models/request/PipRequest';
import {cloneDeep} from 'lodash';

const hearingService = new HearingService();

export default class CaseReferenceNumberSearchResultController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const searchInput = req.query['search-input'] as string;
    const searchResults = await hearingService.getCaseByNumber(searchInput);

    if (searchResults) {
      res.render('case-reference-number-search-results', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['case-reference-number-search-results']),
        searchInput,
        searchResults,
      });
    } else {
      res.render('error',
        req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
