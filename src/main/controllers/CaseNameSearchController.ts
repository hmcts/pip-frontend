import { Response} from 'express';
import { HearingService } from '../service/hearingService';
import { cloneDeep } from 'lodash';
import { PipRequest } from '../models/request/PipRequest';

const hearingService = new HearingService();

export default class CaseNameSearchController {

  public get(req: PipRequest, res: Response): void {
    if (req.query.error === 'true') {
      res.render('case-name-search', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['case-name-search']),
        noResultsError: true,
      });
    } else {
      res.render('case-name-search', {...cloneDeep(req.i18n.getDataByLanguage(req.lng)['case-name-search'])});
    }
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const searchInput = req.body['case-name'];
    if (searchInput) {
      const searchResults = await hearingService.getHearingsByCaseName(searchInput.toLowerCase());
      if (searchResults.length) {
        res.redirect('case-name-search-results?search=' + searchInput);
      } else {
        res.render('case-name-search', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['case-name-search']),
          noResultsError: true,
        });
      }
    } else {
      res.render('case-name-search', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['case-name-search']),
        noResultsError: true,
      });
    }
  }
}
