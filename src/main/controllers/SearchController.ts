import { Request, Response } from 'express';
import {CourtActions} from '../resources/actions/courtActions';

const courtList = new CourtActions();
export default class SearchController {
  public get(req: Request, res: Response): void {
    const autocompleteList = courtList.getCourtsList();
    res.render('search', {autocompleteList: autocompleteList});
  }

  public post(req: Request, res: Response): void {
    const searchInput = req.body['input-autocomplete'];
    res.redirect(`search-results?search-input=${searchInput}`);
  }
}
