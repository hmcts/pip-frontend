import { Request, Response } from 'express';

export default class ViewOptionController {
  public get(req: Request, res: Response): void {
    res.render('view-option');
  }

  public post(req: Request, res: Response): void {
    if (req.body['view-choice'] === 'search') {
      res.redirect('search-option');
    }
    else if (req.body['view-choice'] === 'live') {
      res.redirect('live-case');
    }
    else {
      res.redirect('view-option');
    }
  }
}
