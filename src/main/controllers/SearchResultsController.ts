import { Request, Response } from 'express';
import { InputFilterService} from '../service/inputFilterService';

const inputFilterService = new InputFilterService();
const searchAgainst = ['name', 'jurisdiction', 'location'];

export default class SearchResultsController {
  public get(req: Request, res: Response): void {
    const searchInput = req.query['search-input'];
    const searchResults = inputFilterService.findCourts(searchInput, searchAgainst);

    if (searchResults.length > 0) {
      res.render('search-results', {searchInput, searchResults});
    } else {
      res.render('error');
    }
  }
}
