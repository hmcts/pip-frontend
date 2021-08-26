import { Request, Response } from 'express';

export default class SearchOptionController {
  public get(req: Request, res: Response): void {
    res.render('search-option');
  }

  public post(req: Request, res: Response): void {
    if (req.body['find-choice'] === 'search') {
      res.redirect('search');
    }
    else if (req.body['find-choice'] === 'find') {
      res.redirect('alphabetical-search');
    }
    else {
      null;
    }
  }
}
