import { Request, Response } from 'express';
import { CourtActions } from '../resources/actions/courtActions';
import {PipApi} from '../utils/PipApi';
import {InputFilterService} from '../service/inputFilterService';

const inputService = new InputFilterService();
const searchAgainst = ['name', 'jurisdiction', 'location'];

let _api: PipApi;

export default class SearchController {

  constructor(private readonly api: PipApi) {
    _api = this.api;
  }

  public async get(req: Request, res: Response): Promise<void> {
    const courtList = new CourtActions(_api);
    const autocompleteList = await courtList.getCourtsList();
    res.render('search', { autocompleteList: autocompleteList, invalidInputError: false, noResultsError: false });
  }

  public async post(req: Request, res: Response): Promise<void> {
    const searchInput = req.body['input-autocomplete'];
    const courtList = new CourtActions(_api);
    const autocompleteList = await courtList.getCourtsList();
    if (searchInput && searchInput.length >= 3 && autocompleteList) {
      (inputService.findCourts(searchInput, searchAgainst, autocompleteList).length) ?
        res.redirect(`hearing-list?search-input=${searchInput}`) :
        res.render('search', { autocompleteList: autocompleteList, invalidInputError: false, noResultsError: true});
    } else {
      res.render('search', { autocompleteList: autocompleteList, invalidInputError: true, noResultsError: false });
    }
  }
}
