import { Response} from 'express';
import { HearingService } from '../service/hearingService';
import { cloneDeep } from 'lodash';
import { PipRequest } from '../models/request/PipRequest';

const hearingService = new HearingService();

export default class CaseNameSearchResultsController {
  public async get(req: PipRequest , res: Response): Promise<void> {
    const searchQuery = req.query.search;
    if (searchQuery) {
      const searchResults = await hearingService.getHearingsByCaseName(searchQuery.toString());
      res.render('case-name-search-results', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['case-name-search-results']),
        searchResults,
      });
    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
