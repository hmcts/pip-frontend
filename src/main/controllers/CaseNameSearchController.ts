import { Request, Response} from 'express';

export default class CaseNameSearchController {

  constructor() {
  }

  public get(req: Request, res: Response): void {
    res.render('case-name-search', { noResultsError: false});
  }

  public post(req: Request, res: Response): void {
    const searchInput = req.body['case-name'];
    if (searchInput) {
      res.redirect('case-name-search-results');
    } else {
      res.render('case-name-search', { noResultsError: true});
    }

  }
}
