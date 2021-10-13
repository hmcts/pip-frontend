import { Request, Response} from 'express';
import { PipApi } from '../utils/PipApi';
import { HearingActions } from '../resources/actions/hearingActions';

let _api: PipApi;
export default class CaseNameSearchController {

  constructor(private readonly api: PipApi) {
    _api = this.api;
  }

  public get(req: Request, res: Response): void {
    if (req.query.error === 'true') {
      res.render('case-name-search', { noResultsError: true});
    } else {
      res.render('case-name-search');
    }

  }

  public async post(req: Request, res: Response): Promise<void> {
    const searchInput = req.body['case-name'];
    if (searchInput) {
      const searchResults = await new HearingActions(_api).findCourtHearings(searchInput);
      if (searchResults.length) {
        res.redirect('case-name-search-results?search=' + searchInput);
      } else {
        res.render('case-name-search', { noResultsError: true});
      }
    } else {
      res.render('case-name-search', { noResultsError: true});
    }

  }
}
