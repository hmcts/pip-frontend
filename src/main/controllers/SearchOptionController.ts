import { Application } from 'express';

export default class SearchOptionController {
  public get(req: Request, res: Application): void {
    res.render('search-option');
  }
}
