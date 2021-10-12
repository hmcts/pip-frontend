import { Request, Response} from 'express';

export default class CaseNameSearchResultsController {

  constructor() {
  }

  public get(req: Request, res: Response): void {
    res.render('case-name-search-results');
  }
}
