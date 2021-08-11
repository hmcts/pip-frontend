import { Request, Response } from 'express';
import { CourtActions } from '../resources/actions/courtActions';
import { InputFilterService } from '../service/inputFilterService';

const courtList = new CourtActions();
const autocompleteList = courtList.getCourtsList();
const inputService = new InputFilterService();
const searchAgainst = ['name', 'jurisdiction', 'location'];

export default class SearchController {
  public get(req: Request, res: Response): void {
    res.render('search', { autocompleteList: autocompleteList, invalidInputError: false, noResultsError: false });
  }

  public post(req: Request, res: Response): void {
    const searchInput = req.body['input-autocomplete'];
    if (searchInput && searchInput.length >= 3) {
      (inputService.findCourts(searchInput, searchAgainst).length) ?
        res.redirect(`search-results?search-input=${searchInput}`) :
        res.render('search', { autocompleteList: autocompleteList, invalidInputError: false, noResultsError: true});
    } else {
      res.render('search', { autocompleteList: autocompleteList, invalidInputError: true, noResultsError: false });
    }
  }
}
