import { Request, Response } from 'express';
import { CourtActions } from '../resources/actions/courtActions';

const courtList = new CourtActions();
const autocompleteList = courtList.getCourtsList();

export default class SearchController {
  public get(req: Request, res: Response): void {

    res.render('search', {autocompleteList: autocompleteList, invalidInputError: false, noResultsError: false});
  }

  public post(req: Request, res: Response): void {
    const searchInput = req.body['input-autocomplete'];
    if (searchInput) {
      if (searchInput.length < 3) {
        res.render('search', {autocompleteList: autocompleteList, invalidInputError: true, noResultsError: false});
      } else {
        res.redirect(`search-results?search-input=${searchInput}`);
      }
    } else {
      res.render('search', {autocompleteList: autocompleteList, invalidInputError: false, noResultsError: true});
    }
  }
}
