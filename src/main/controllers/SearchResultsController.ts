import { Request, Response } from 'express';
import {PipApi} from '../utils/PipApi';
import { CourtActions } from '../resources/actions/courtActions';


let _api: PipApi;
export default class SearchResultsController {

  constructor(private readonly api: PipApi) {
    _api = this.api;
  }

  public async get(req: Request, res: Response): Promise<void> {
    const searchInput = req.query['search-input'];

    const searchResults = await new CourtActions(_api).getCourtList(searchInput);

    if (searchResults) {
      res.render('search-results', {searchInput, searchResults});
    } else {
      res.render('error');
    }
  }
}
