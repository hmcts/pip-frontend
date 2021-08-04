import { Response } from 'express';

export default class SearchController {
  public get(req: Request, res: Response): void {
    res.render('search');
  }

  public post(req: Request, res: Response): void {
    const searchInput = req.body['search-input'];
    // TODO: PUB-508
    console.log(searchInput);
    res.redirect('/search-results');
  }
}
