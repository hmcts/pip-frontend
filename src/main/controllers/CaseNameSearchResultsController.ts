import { Request, Response} from 'express';
import { HearingActions } from '../resources/actions/hearingActions';
import { PipApi } from '../utils/PipApi';

let _api: PipApi;
export default class CaseNameSearchResultsController {

  constructor(private readonly api: PipApi) {
    _api = this.api;
  }

  public async get(req: Request, res: Response): Promise<void> {
    const searchQuery = req.query.search;
    if (searchQuery) {
      const searchResults = await new HearingActions(_api).findCourtHearings(searchQuery.toString());
      res.render('case-name-search-results', {searchResults});
    } else {
      res.render('error');
    }
  }
}
