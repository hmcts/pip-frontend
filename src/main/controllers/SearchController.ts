import { Request, Response } from 'express';
import { CourtActions } from '../resources/actions/courtActions';

const courtList = new CourtActions();
const autocompleteList = courtList.getCourtsList();

export default class SearchController {
  public get(req: Request, res: Response): void {
    res.render('search', { autocompleteList: autocompleteList, invalidInputError: false, noResultsError: false });
  }

  public post(req: Request, res: Response): void {
    const searchInput = req.body['input-autocomplete'];
    if (searchInput && searchInput.length >= 3) {
      // check if there is court name with partial input
      (courtList.courtNameIncluded(searchInput)) ?
        res.redirect(`search-results?search-input=${searchInput}`) :
        res.render('search', { autocompleteList: autocompleteList, invalidInputError: false, noResultsError: true });
    } else {
      res.render('search', { autocompleteList: autocompleteList, invalidInputError: true, noResultsError: false });
    }
  }
}
