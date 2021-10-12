import { Request, Response} from 'express';

export default class CaseNameSearchController {

  constructor() {
  }

  public get(req: Request, res: Response): void {
    res.render('case-name-search');
  }

  public post(req: Request, res: Response): void {
    res.render('case-name-search');
  }
}
