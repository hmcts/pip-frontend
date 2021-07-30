import { Response } from 'express';


export default class NotFoundPageController {
  public get(req: Request, res: Response): void {
    res.render('not-found');
  }
}
