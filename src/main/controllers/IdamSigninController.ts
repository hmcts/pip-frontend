import { Request, Response } from 'express';

export default class IdamSigninController {
  public get(req: Request, res: Response): void {
    res.render('idam-signin');
  }

  public post(req: Request, res: Response): void {
    const selectChoice = req.body['idam-select'];
    if (selectChoice == 'crime') {
      res.redirect('https://www.google.com');
    } else if (selectChoice == 'cft') {
      res.redirect('https://www.google.com');
    } else {
      res.redirect('idam-signin');
    }
  }
}
